namespace BourbonBuddy.Domain.Entities;

public class Bottle
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal? Abv { get; set; }
    public int? AgeYears { get; set; }
    public string? Region { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? Description { get; set; }

    public Guid? CategoryId { get; set; }
    public BottleCategory? BottleCategory { get; set; }

    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<UserCellarItem> CellarItems { get; set; } = new List<UserCellarItem>();
}
