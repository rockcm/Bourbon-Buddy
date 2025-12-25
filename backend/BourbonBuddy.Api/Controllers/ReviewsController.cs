using BourbonBuddy.Api.Contracts;
using BourbonBuddy.Api.Data;
using BourbonBuddy.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BourbonBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public ReviewsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReviewResponse>>> GetAsync(
        [FromQuery] Guid? bottleId,
        [FromQuery] Guid? userId,
        [FromQuery] int limit = 50,
        CancellationToken cancellationToken = default)
    {
        limit = Math.Clamp(limit, 1, 100);
        var query = _dbContext.Reviews
            .Include(r => r.NoteTags)
            .Include(r => r.Images).ThenInclude(i => i.ImageAsset)
            .Include(r => r.User)
            .AsQueryable();

        if (bottleId.HasValue)
        {
            query = query.Where(r => r.BottleId == bottleId.Value);
        }

        if (userId.HasValue)
        {
            query = query.Where(r => r.UserId == userId.Value);
        }

        var reviews = await query
            .OrderByDescending(r => r.CreatedAt)
            .Take(limit)
            .ToListAsync(cancellationToken);

        var response = reviews.Select(r => new ReviewResponse(
            r.Id,
            r.UserId,
            r.User?.Username ?? string.Empty,
            r.BottleId,
            r.Rating,
            r.NoseRating,
            r.PalateRating,
            r.MouthfeelRating,
            r.ValueRating,
            r.Visibility,
            r.Notes,
            r.CreatedAt,
            r.NoteTags.Select(t => t.Tag).ToList(),
            r.Images.Select(i => i.ImageAsset?.Url ?? string.Empty).Where(u => !string.IsNullOrWhiteSpace(u)).ToList(),
            r.Likes.Count,
            r.Comments.Count));

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<ReviewResponse>> CreateAsync([FromBody] ReviewCreateRequest request, CancellationToken cancellationToken)
    {
        var userExists = await _dbContext.Users.AnyAsync(u => u.Id == request.UserId, cancellationToken);
        var bottleExists = await _dbContext.Bottles.AnyAsync(b => b.Id == request.BottleId, cancellationToken);

        if (!userExists || !bottleExists)
        {
            return NotFound("User or bottle not found");
        }

        var review = new Review
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            BottleId = request.BottleId,
            Rating = request.Rating,
            NoseRating = request.NoseRating,
            PalateRating = request.PalateRating,
            MouthfeelRating = request.MouthfeelRating,
            ValueRating = request.ValueRating,
            Visibility = request.Visibility,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Reviews.Add(review);

        if (request.Tags?.Any() == true)
        {
            foreach (var tag in request.Tags.Distinct(StringComparer.OrdinalIgnoreCase))
            {
                _dbContext.ReviewNoteTags.Add(new ReviewNoteTag
                {
                    Id = Guid.NewGuid(),
                    Review = review,
                    Tag = tag.Trim()
                });
            }
        }

        if (request.ImageUrls?.Any() == true)
        {
            foreach (var url in request.ImageUrls.Where(u => !string.IsNullOrWhiteSpace(u)))
            {
                var image = new ImageAsset
                {
                    Id = Guid.NewGuid(),
                    Url = url,
                    OwnerType = nameof(Review),
                    OwnerId = review.Id,
                    CreatedAt = DateTime.UtcNow
                };

                _dbContext.Images.Add(image);
                _dbContext.ReviewImages.Add(new ReviewImage
                {
                    Id = Guid.NewGuid(),
                    Review = review,
                    ImageAsset = image
                });
            }
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        var created = await _dbContext.Reviews
            .Include(r => r.NoteTags)
            .Include(r => r.Images).ThenInclude(i => i.ImageAsset)
            .Include(r => r.User)
            .FirstAsync(r => r.Id == review.Id, cancellationToken);

        var response = new ReviewResponse(
            created.Id,
            created.UserId,
            created.User?.Username ?? string.Empty,
            created.BottleId,
            created.Rating,
            created.NoseRating,
            created.PalateRating,
            created.MouthfeelRating,
            created.ValueRating,
            created.Visibility,
            created.Notes,
            created.CreatedAt,
            created.NoteTags.Select(t => t.Tag).ToList(),
            created.Images.Select(i => i.ImageAsset?.Url ?? string.Empty).Where(u => !string.IsNullOrWhiteSpace(u)).ToList(),
            created.Likes.Count,
            created.Comments.Count);

        return CreatedAtAction(nameof(GetAsync), new { id = created.Id }, response);
    }
}
