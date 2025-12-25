using System.ComponentModel.DataAnnotations;

namespace BourbonBuddy.Api.Contracts;

public record ReviewCreateRequest(
    [Required] Guid UserId,
    [Required] Guid BottleId,
    [Range(0, 5)] decimal Rating,
    [Range(0, 5)] decimal? NoseRating,
    [Range(0, 5)] decimal? PalateRating,
    [Range(0, 5)] decimal? MouthfeelRating,
    [Range(0, 5)] decimal? ValueRating,
    [Required, StringLength(32)] string Visibility,
    [Required, StringLength(8000)] string Notes,
    IReadOnlyCollection<string> Tags,
    IReadOnlyCollection<string> ImageUrls);

public record ReviewResponse(
    Guid Id,
    Guid UserId,
    string Username,
    Guid BottleId,
    decimal Rating,
    decimal? NoseRating,
    decimal? PalateRating,
    decimal? MouthfeelRating,
    decimal? ValueRating,
    string Visibility,
    string Notes,
    DateTime CreatedAt,
    IReadOnlyCollection<string> Tags,
    IReadOnlyCollection<string> ImageUrls,
    int LikeCount,
    int CommentCount);

public record ReviewSummary(
    Guid BottleId,
    decimal AverageRating,
    int ReviewCount);
