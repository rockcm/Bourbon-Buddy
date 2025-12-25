using BourbonBuddy.Api.Contracts;
using BourbonBuddy.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BourbonBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DiscoverController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public DiscoverController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<DiscoverResponse>> GetAsync(CancellationToken cancellationToken)
    {
        var recentThreshold = DateTime.UtcNow.AddDays(-30);

        var trending = await _dbContext.Reviews
            .Include(r => r.Bottle)
            .Where(r => r.CreatedAt >= recentThreshold)
            .GroupBy(r => r.BottleId)
            .Select(g => new RankedBottle(
                g.Key,
                g.First().Bottle!.Name,
                g.First().Bottle!.Brand,
                g.First().Bottle!.Category,
                g.Average(r => r.Rating),
                g.Count()))
            .OrderByDescending(r => r.ReviewCount)
            .ThenByDescending(r => r.AverageRating)
            .Take(10)
            .ToListAsync(cancellationToken);

        var topRated = await _dbContext.Reviews
            .Include(r => r.Bottle)
            .GroupBy(r => r.BottleId)
            .Select(g => new RankedBottle(
                g.Key,
                g.First().Bottle!.Name,
                g.First().Bottle!.Brand,
                g.First().Bottle!.Category,
                g.Average(r => r.Rating),
                g.Count()))
            .Where(b => b.ReviewCount >= 3)
            .OrderByDescending(r => r.AverageRating)
            .ThenByDescending(r => r.ReviewCount)
            .Take(10)
            .ToListAsync(cancellationToken);

        var bestValue = await _dbContext.Reviews
            .Include(r => r.Bottle)
            .Where(r => r.ValueRating != null)
            .GroupBy(r => r.BottleId)
            .Select(g => new RankedBottle(
                g.Key,
                g.First().Bottle!.Name,
                g.First().Bottle!.Brand,
                g.First().Bottle!.Category,
                g.Average(r => r.ValueRating ?? 0),
                g.Count()))
            .Where(b => b.ReviewCount >= 3)
            .OrderByDescending(r => r.AverageRating)
            .Take(10)
            .ToListAsync(cancellationToken);

        return Ok(new DiscoverResponse(trending, topRated, bestValue));
    }
}
