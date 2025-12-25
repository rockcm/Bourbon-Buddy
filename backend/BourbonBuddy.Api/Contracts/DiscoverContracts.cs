namespace BourbonBuddy.Api.Contracts;

public record RankedBottle(
    Guid BottleId,
    string Name,
    string Brand,
    string Category,
    decimal? AverageRating,
    int ReviewCount);

public record DiscoverResponse(
    IReadOnlyCollection<RankedBottle> Trending,
    IReadOnlyCollection<RankedBottle> TopRated,
    IReadOnlyCollection<RankedBottle> BestValue);
