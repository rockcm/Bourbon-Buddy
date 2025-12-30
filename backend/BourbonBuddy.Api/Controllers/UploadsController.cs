using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BourbonBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadsController : ControllerBase
{
    [HttpPost]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ActionResult<IEnumerable<string>>> UploadAsync(IFormFileCollection files, CancellationToken cancellationToken)
    {
        if (files.Count == 0)
        {
            return BadRequest("No files provided");
        }

        var uploadRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        Directory.CreateDirectory(uploadRoot);

        var urls = new List<string>();
        foreach (var file in files)
        {
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var path = Path.Combine(uploadRoot, fileName);
            await using var stream = System.IO.File.Create(path);
            await file.CopyToAsync(stream, cancellationToken);
            urls.Add($"/uploads/{fileName}");
        }

        return Ok(urls);
    }
}
