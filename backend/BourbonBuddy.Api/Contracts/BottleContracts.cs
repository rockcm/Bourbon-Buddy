namespace BourbonBuddy.Api.Contracts;

public record BottleRequest(
    string Name,
    string Brand,
    string Category,
    decimal? Abv,
    int? AgeYears,
    string? Region,
    string? ThumbnailUrl,
    string? Description,
    Guid? CategoryId);

public record BottleResponse(
    Guid Id,
    string Name,
    string Brand,
    string Category,
    decimal? Abv,
    int? AgeYears,
    string? Region,
    string? ThumbnailUrl,
    string? Description,
    Guid? CategoryId,
    decimal? AverageRating,
    int ReviewCount);
