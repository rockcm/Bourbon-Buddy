using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BourbonBuddy.Api.Contracts;
using BourbonBuddy.Domain.Entities;
using Microsoft.IdentityModel.Tokens;

namespace BourbonBuddy.Api.Services;

public class TokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public TokenResponse CreateTokens(User user)
    {
        var access = CreateAccessToken(user);
        var refresh = CreateRefreshToken();
        return new TokenResponse(access, refresh);
    }

    public string CreateAccessToken(User user)
    {
        var key = _configuration["Jwt:Key"] ?? "local-dev-secret-change-me";
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

        var token = new JwtSecurityToken(
            claims: new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.Username),
                new("displayName", user.DisplayName ?? user.Username)
            },
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string CreateRefreshToken()
    {
        var bytes = new byte[32];
        Random.Shared.NextBytes(bytes);
        return Convert.ToBase64String(bytes);
    }
}
