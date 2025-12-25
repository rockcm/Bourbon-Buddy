using System.ComponentModel.DataAnnotations;

namespace BourbonBuddy.Api.Contracts;

public record BottleRequest(
    [Required, StringLength(120, MinimumLength = 2)] string Name,
    [Required, StringLength(120, MinimumLength = 2)] string Brand,
    [Required, StringLength(80, MinimumLength = 2)] string Category,
    [Range(0, 90)] decimal? Abv,
    [Range(0, 60)] int? AgeYears,
    [StringLength(160)] string? Region,
    [Url] string? ThumbnailUrl,
    [StringLength(4000)] string? Description,
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
