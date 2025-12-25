namespace BourbonBuddy.Domain.Entities;

public class ReviewNoteTag
{
    public Guid Id { get; set; }
    public Guid ReviewId { get; set; }
    public string Tag { get; set; } = string.Empty;

    public Review? Review { get; set; }
}
