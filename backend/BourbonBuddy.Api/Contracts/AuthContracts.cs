namespace BourbonBuddy.Api.Contracts;

public record SignupRequest(string Username, string Email, string Password, string? DisplayName);
public record LoginRequest(string UsernameOrEmail, string Password);
public record TokenResponse(string AccessToken, string RefreshToken);
public record AuthEnvelope(UserProfileResponse User, TokenResponse Tokens);
public record RefreshRequest(string RefreshToken);
public record LogoutRequest(string RefreshToken);
