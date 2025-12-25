using BourbonBuddy.Api.Contracts;
using BourbonBuddy.Api.Data;
using BourbonBuddy.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BourbonBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CellarController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public CellarController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CellarItemResponse>>> GetAsync([FromQuery] Guid userId, CancellationToken cancellationToken)
    {
        var items = await _dbContext.CellarItems
            .Include(c => c.Bottle)
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.PurchaseDate)
            .ThenBy(c => c.Bottle!.Brand)
            .ToListAsync(cancellationToken);

        var response = items.Select(item => new CellarItemResponse(
            item.Id,
            item.UserId,
            item.BottleId,
            item.Quantity,
            item.Opened,
            item.PurchasePrice,
            item.PurchaseDate,
            item.Notes,
            item.Bottle?.Name ?? string.Empty,
            item.Bottle?.Brand ?? string.Empty,
            item.Bottle?.Category ?? string.Empty));

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<CellarItemResponse>> AddAsync([FromBody] CellarItemRequest request, CancellationToken cancellationToken)
    {
        var exists = await _dbContext.CellarItems.AnyAsync(c => c.UserId == request.UserId && c.BottleId == request.BottleId, cancellationToken);
        if (exists)
        {
            return Conflict("Bottle already in cellar; update quantity instead");
        }

        var item = new UserCellarItem
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            BottleId = request.BottleId,
            Quantity = request.Quantity,
            Opened = request.Opened,
            PurchasePrice = request.PurchasePrice,
            PurchaseDate = request.PurchaseDate,
            Notes = request.Notes
        };

        _dbContext.CellarItems.Add(item);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var bottle = await _dbContext.Bottles.FirstOrDefaultAsync(b => b.Id == item.BottleId, cancellationToken);
        var response = new CellarItemResponse(
            item.Id,
            item.UserId,
            item.BottleId,
            item.Quantity,
            item.Opened,
            item.PurchasePrice,
            item.PurchaseDate,
            item.Notes,
            bottle?.Name ?? string.Empty,
            bottle?.Brand ?? string.Empty,
            bottle?.Category ?? string.Empty);

        return CreatedAtAction(nameof(GetAsync), new { userId = item.UserId }, response);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CellarItemResponse>> UpdateAsync(Guid id, [FromBody] CellarItemRequest request, CancellationToken cancellationToken)
    {
        var item = await _dbContext.CellarItems.Include(c => c.Bottle).FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (item is null)
        {
            return NotFound();
        }

        item.Quantity = request.Quantity;
        item.Opened = request.Opened;
        item.PurchasePrice = request.PurchasePrice;
        item.PurchaseDate = request.PurchaseDate;
        item.Notes = request.Notes;

        await _dbContext.SaveChangesAsync(cancellationToken);

        var response = new CellarItemResponse(
            item.Id,
            item.UserId,
            item.BottleId,
            item.Quantity,
            item.Opened,
            item.PurchasePrice,
            item.PurchaseDate,
            item.Notes,
            item.Bottle?.Name ?? string.Empty,
            item.Bottle?.Brand ?? string.Empty,
            item.Bottle?.Category ?? string.Empty);

        return Ok(response);
    }
}
