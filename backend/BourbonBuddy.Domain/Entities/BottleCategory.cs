namespace BourbonBuddy.Domain.Entities;

public class BottleCategory
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ICollection<Bottle> Bottles { get; set; } = new List<Bottle>();
}
