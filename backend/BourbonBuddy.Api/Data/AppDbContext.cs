using BourbonBuddy.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BourbonBuddy.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Follow> Follows => Set<Follow>();
    public DbSet<Bottle> Bottles => Set<Bottle>();
    public DbSet<BottleCategory> Categories => Set<BottleCategory>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<ReviewImage> ReviewImages => Set<ReviewImage>();
    public DbSet<ReviewNoteTag> ReviewNoteTags => Set<ReviewNoteTag>();
    public DbSet<UserCellarItem> CellarItems => Set<UserCellarItem>();
    public DbSet<Like> Likes => Set<Like>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<ImageAsset> Images => Set<ImageAsset>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Follow>()
            .HasOne(f => f.Follower)
            .WithMany(u => u.Following)
            .HasForeignKey(f => f.FollowerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Follow>()
            .HasOne(f => f.Followee)
            .WithMany(u => u.Followers)
            .HasForeignKey(f => f.FolloweeId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Follow>()
            .HasIndex(f => new { f.FollowerId, f.FolloweeId })
            .IsUnique();

        modelBuilder.Entity<Bottle>()
            .HasOne(b => b.BottleCategory)
            .WithMany(c => c.Bottles)
            .HasForeignKey(b => b.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Bottle)
            .WithMany(b => b.Reviews)
            .HasForeignKey(r => r.BottleId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ReviewImage>()
            .HasOne(ri => ri.Review)
            .WithMany(r => r.Images)
            .HasForeignKey(ri => ri.ReviewId);

        modelBuilder.Entity<ReviewImage>()
            .HasOne(ri => ri.ImageAsset)
            .WithMany()
            .HasForeignKey(ri => ri.ImageAssetId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ReviewNoteTag>()
            .Property(t => t.Tag)
            .HasMaxLength(64);

        modelBuilder.Entity<ReviewNoteTag>()
            .HasIndex(t => new { t.ReviewId, t.Tag })
            .IsUnique();

        modelBuilder.Entity<UserCellarItem>()
            .HasOne(c => c.User)
            .WithMany(u => u.Cellar)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserCellarItem>()
            .HasOne(c => c.Bottle)
            .WithMany(b => b.CellarItems)
            .HasForeignKey(c => c.BottleId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserCellarItem>()
            .HasIndex(c => new { c.UserId, c.BottleId })
            .IsUnique();

        modelBuilder.Entity<RefreshToken>()
            .HasOne(r => r.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
