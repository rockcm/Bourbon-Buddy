namespace BourbonBuddy.Api.Contracts;

public record CellarItemRequest(
    Guid UserId,
    Guid BottleId,
    int Quantity,
    bool Opened,
    decimal? PurchasePrice,
    DateTime? PurchaseDate,
    string? Notes);

public record CellarItemResponse(
    Guid Id,
    Guid UserId,
    Guid BottleId,
    int Quantity,
    bool Opened,
    decimal? PurchasePrice,
    DateTime? PurchaseDate,
    string? Notes,
    string BottleName,
    string BottleBrand,
    string Category);
