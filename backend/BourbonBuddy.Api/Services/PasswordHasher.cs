using System.Security.Cryptography;

namespace BourbonBuddy.Api.Services;

public class PasswordHasher
{
    private const int SaltSize = 16;
    private const int KeySize = 32;
    private const int Iterations = 10000;

    public string Hash(string password)
    {
        using var derive = new Rfc2898DeriveBytes(password, SaltSize, Iterations, HashAlgorithmName.SHA256);
        var salt = Convert.ToBase64String(derive.Salt);
        var key = Convert.ToBase64String(derive.GetBytes(KeySize));
        return $"{Iterations}.{salt}.{key}";
    }

    public bool Verify(string password, string hash)
    {
        var parts = hash.Split('.', 3);
        if (parts.Length != 3)
        {
            return false;
        }

        var iterations = int.Parse(parts[0]);
        var salt = Convert.FromBase64String(parts[1]);
        var key = Convert.FromBase64String(parts[2]);

        using var derive = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA256);
        var attempt = derive.GetBytes(KeySize);

        return attempt.SequenceEqual(key);
    }
}
