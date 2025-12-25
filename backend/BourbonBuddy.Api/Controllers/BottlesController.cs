using BourbonBuddy.Api.Contracts;
using BourbonBuddy.Api.Data;
using BourbonBuddy.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BourbonBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BottlesController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public BottlesController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BottleResponse>>> GetAsync(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] int limit = 50,
        CancellationToken cancellationToken = default)
    {
        limit = Math.Clamp(limit, 1, 100);

        var query = _dbContext.Bottles.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var lowered = search.ToLower();
            query = query.Where(b =>
                EF.Functions.ILike(b.Name, $"%{lowered}%") ||
                EF.Functions.ILike(b.Brand, $"%{lowered}%") ||
                EF.Functions.ILike(b.Category, $"%{lowered}%"));
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(b => b.Category == category);
        }

        var bottles = await query
            .OrderBy(b => b.Brand)
            .ThenBy(b => b.Name)
            .Take(limit)
            .Select(b => new BottleResponse(
                b.Id,
                b.Name,
                b.Brand,
                b.Category,
                b.Abv,
                b.AgeYears,
                b.Region,
                b.ThumbnailUrl,
                b.Description,
                b.CategoryId,
                b.Reviews.Any() ? b.Reviews.Average(r => r.Rating) : null,
                b.Reviews.Count))
            .ToListAsync(cancellationToken);

        return Ok(bottles);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BottleResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var bottle = await _dbContext.Bottles
            .Include(b => b.Reviews)
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

        if (bottle is null)
        {
            return NotFound();
        }

        var response = new BottleResponse(
            bottle.Id,
            bottle.Name,
            bottle.Brand,
            bottle.Category,
            bottle.Abv,
            bottle.AgeYears,
            bottle.Region,
            bottle.ThumbnailUrl,
            bottle.Description,
            bottle.CategoryId,
            bottle.Reviews.Any() ? bottle.Reviews.Average(r => r.Rating) : null,
            bottle.Reviews.Count);

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<BottleResponse>> CreateAsync([FromBody] BottleRequest request, CancellationToken cancellationToken)
    {
        var bottle = new Bottle
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Brand = request.Brand,
            Category = request.Category,
            Abv = request.Abv,
            AgeYears = request.AgeYears,
            Region = request.Region,
            ThumbnailUrl = request.ThumbnailUrl,
            Description = request.Description,
            CategoryId = request.CategoryId
        };

        _dbContext.Bottles.Add(bottle);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var response = new BottleResponse(
            bottle.Id,
            bottle.Name,
            bottle.Brand,
            bottle.Category,
            bottle.Abv,
            bottle.AgeYears,
            bottle.Region,
            bottle.ThumbnailUrl,
            bottle.Description,
            bottle.CategoryId,
            null,
            0);

        return CreatedAtAction(nameof(GetByIdAsync), new { id = bottle.Id }, response);
    }
}
