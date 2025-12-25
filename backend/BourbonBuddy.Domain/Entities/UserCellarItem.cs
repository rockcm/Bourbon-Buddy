namespace BourbonBuddy.Domain.Entities;

public class UserCellarItem
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid BottleId { get; set; }
    public int Quantity { get; set; } = 1;
    public bool Opened { get; set; }
    public decimal? PurchasePrice { get; set; }
    public DateTime? PurchaseDate { get; set; }
    public string? Notes { get; set; }

    public User? User { get; set; }
    public Bottle? Bottle { get; set; }
}
