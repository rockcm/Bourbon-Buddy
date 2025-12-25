namespace BourbonBuddy.Domain.Entities;

public class Follow
{
    public Guid Id { get; set; }
    public Guid FollowerId { get; set; }
    public Guid FolloweeId { get; set; }

    public User? Follower { get; set; }
    public User? Followee { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
