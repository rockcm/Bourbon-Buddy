namespace BourbonBuddy.Domain.Entities;

public class ReviewImage
{
    public Guid Id { get; set; }
    public Guid ReviewId { get; set; }
    public Guid ImageAssetId { get; set; }

    public Review? Review { get; set; }
    public ImageAsset? ImageAsset { get; set; }
}
