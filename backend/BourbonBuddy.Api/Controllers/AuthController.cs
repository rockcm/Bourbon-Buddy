using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BourbonBuddy.Api.Contracts;
using BourbonBuddy.Api.Data;
using BourbonBuddy.Api.Services;
using BourbonBuddy.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BourbonBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly PasswordHasher _hasher;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext dbContext, PasswordHasher hasher, TokenService tokenService)
    {
        _dbContext = dbContext;
        _hasher = hasher;
        _tokenService = tokenService;
    }

    [HttpPost("signup")]
    public async Task<ActionResult<AuthEnvelope>> SignupAsync([FromBody] SignupRequest request, CancellationToken cancellationToken)
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
            PasswordHash = _hasher.Hash(request.Password),
            DisplayName = request.DisplayName ?? request.Username
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var tokens = await IssueTokensAsync(user, cancellationToken);
        return Created(string.Empty, new AuthEnvelope(await MapProfile(user, cancellationToken), tokens));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthEnvelope>> LoginAsync([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(
            u => u.Username == request.UsernameOrEmail || u.Email == request.UsernameOrEmail,
            cancellationToken);

        if (user is null || !_hasher.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid credentials");
        }

        var tokens = await IssueTokensAsync(user, cancellationToken);
        return Ok(new AuthEnvelope(await MapProfile(user, cancellationToken), tokens));
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<TokenResponse>> RefreshAsync([FromBody] RefreshRequest request, CancellationToken cancellationToken)
    {
        var refresh = await _dbContext.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == request.RefreshToken && !r.Revoked, cancellationToken);

        if (refresh is null || refresh.ExpiresAt <= DateTime.UtcNow || refresh.User is null)
        {
            return Unauthorized();
        }

        refresh.Revoked = true;
        var tokens = await IssueTokensAsync(refresh.User, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return Ok(tokens);
    }

    [HttpPost("logout")]
    public async Task<ActionResult> LogoutAsync([FromBody] LogoutRequest request, CancellationToken cancellationToken)
    {
        var refresh = await _dbContext.RefreshTokens.FirstOrDefaultAsync(r => r.Token == request.RefreshToken, cancellationToken);
        if (refresh is not null)
        {
            refresh.Revoked = true;
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        return NoContent();
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserProfileResponse>> MeAsync(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userId, out var id))
        {
            return Unauthorized();
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user is null)
        {
            return Unauthorized();
        }

        return Ok(await MapProfile(user, cancellationToken));
    }

    private async Task<UserProfileResponse> MapProfile(User user, CancellationToken cancellationToken)
    {
        return await _dbContext.Users
            .Select(u => new UserProfileResponse(
                u.Id,
                u.Username,
                u.Email,
                u.DisplayName,
                u.Bio,
                u.AvatarUrl,
                _dbContext.Follows.Count(f => f.FolloweeId == u.Id),
                _dbContext.Follows.Count(f => f.FollowerId == u.Id),
                _dbContext.Reviews.Count(r => r.UserId == u.Id),
                _dbContext.CellarItems.Count(c => c.UserId == u.Id)))
            .FirstAsync(p => p.Id == user.Id, cancellationToken);
    }

    private async Task<TokenResponse> IssueTokensAsync(User user, CancellationToken cancellationToken)
    {
        var tokens = _tokenService.CreateTokens(user);
        var refreshRecord = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = tokens.RefreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(14),
            Revoked = false
        };

        _dbContext.RefreshTokens.Add(refreshRecord);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return tokens;
    }
}
