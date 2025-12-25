namespace BourbonBuddy.Domain.Entities;

public class Review
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid BottleId { get; set; }

    public decimal Rating { get; set; }
    public decimal? NoseRating { get; set; }
    public decimal? PalateRating { get; set; }
    public decimal? MouthfeelRating { get; set; }
    public decimal? ValueRating { get; set; }

    public string Visibility { get; set; } = "public";
    public string Notes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public User? User { get; set; }
    public Bottle? Bottle { get; set; }
    public ICollection<ReviewImage> Images { get; set; } = new List<ReviewImage>();
    public ICollection<ReviewNoteTag> NoteTags { get; set; } = new List<ReviewNoteTag>();
    public ICollection<Like> Likes { get; set; } = new List<Like>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
