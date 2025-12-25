namespace BourbonBuddy.Domain.Entities;

public class ImageAsset
{
    public Guid Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? OwnerType { get; set; }
    public Guid? OwnerId { get; set; }
    public string? ContentType { get; set; }
    public string? StorageProvider { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
