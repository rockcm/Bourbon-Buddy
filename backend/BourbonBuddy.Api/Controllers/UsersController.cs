using BourbonBuddy.Api.Contracts;
using BourbonBuddy.Api.Data;
using BourbonBuddy.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BourbonBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public UsersController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost]
    public async Task<ActionResult<UserProfileResponse>> RegisterAsync([FromBody] UserCreateRequest request, CancellationToken cancellationToken)
    {
        var exists = await _dbContext.Users.AnyAsync(u => u.Username == request.Username || u.Email == request.Email, cancellationToken);
        if (exists)
        {
            return Conflict("Username or email already taken");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            DisplayName = request.DisplayName,
            Bio = request.Bio,
            AvatarUrl = request.AvatarUrl
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetProfileAsync), new { id = user.Id }, await MapProfileAsync(user.Id, cancellationToken));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserProfileResponse>> GetProfileAsync(Guid id, CancellationToken cancellationToken)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user is null)
        {
            return NotFound();
        }

        var profile = await MapProfileAsync(id, cancellationToken);
        return Ok(profile);
    }

    [HttpPost("{id}/follow")]
    public async Task<ActionResult> FollowAsync(Guid id, [FromBody] FollowRequest request, CancellationToken cancellationToken)
    {
        if (id == request.FollowerId)
        {
            return BadRequest("Cannot follow yourself");
        }

        var follow = await _dbContext.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == request.FollowerId && f.FolloweeId == id, cancellationToken);

        if (follow is not null)
        {
            return NoContent();
        }

        var followerExists = await _dbContext.Users.AnyAsync(u => u.Id == request.FollowerId, cancellationToken);
        var followeeExists = await _dbContext.Users.AnyAsync(u => u.Id == id, cancellationToken);
        if (!followerExists || !followeeExists)
        {
            return NotFound("User not found");
        }

        _dbContext.Follows.Add(new Follow
        {
            Id = Guid.NewGuid(),
            FollowerId = request.FollowerId,
            FolloweeId = id
        });

        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id}/follow")]
    public async Task<ActionResult> UnfollowAsync(Guid id, [FromBody] FollowRequest request, CancellationToken cancellationToken)
    {
        var follow = await _dbContext.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == request.FollowerId && f.FolloweeId == id, cancellationToken);

        if (follow is null)
        {
            return NoContent();
        }

        _dbContext.Follows.Remove(follow);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private async Task<UserProfileResponse> MapProfileAsync(Guid id, CancellationToken cancellationToken)
    {
        var user = await _dbContext.Users
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.Email,
                u.DisplayName,
                u.Bio,
                u.AvatarUrl,
                Followers = _dbContext.Follows.Count(f => f.FolloweeId == u.Id),
                Following = _dbContext.Follows.Count(f => f.FollowerId == u.Id),
                Reviews = _dbContext.Reviews.Count(r => r.UserId == u.Id),
                CellarCount = _dbContext.CellarItems.Count(c => c.UserId == u.Id)
            })
            .FirstAsync(u => u.Id == id, cancellationToken);

        return new UserProfileResponse(
            user.Id,
            user.Username,
            user.Email,
            user.DisplayName,
            user.Bio,
            user.AvatarUrl,
            user.Followers,
            user.Following,
            user.Reviews,
            user.CellarCount);
    }
}
