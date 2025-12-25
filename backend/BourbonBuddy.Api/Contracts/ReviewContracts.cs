namespace BourbonBuddy.Api.Contracts;

public record ReviewCreateRequest(
    Guid UserId,
    Guid BottleId,
    decimal Rating,
    decimal? NoseRating,
    decimal? PalateRating,
    decimal? MouthfeelRating,
    decimal? ValueRating,
    string Visibility,
    string Notes,
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
