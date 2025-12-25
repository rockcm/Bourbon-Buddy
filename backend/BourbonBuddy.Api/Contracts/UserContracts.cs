namespace BourbonBuddy.Api.Contracts;

public record UserCreateRequest(
    string Username,
    string Email,
    string? DisplayName,
    string? Bio,
    string? AvatarUrl);

public record UserProfileResponse(
    Guid Id,
    string Username,
    string Email,
    string? DisplayName,
    string? Bio,
    string? AvatarUrl,
    int Followers,
    int Following,
    int Reviews,
    int CellarCount);

public record FollowRequest(Guid FollowerId);
