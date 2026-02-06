using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace ChineseSale.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<ImageController> _logger;

        public ImageController(IWebHostEnvironment env, ILogger<ImageController> logger)
        {
            _env = env;
            _logger = logger;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile image)
        {
            _logger.LogInformation("A request to upload a image has been sent.");
            if (image == null || image.Length == 0)
            {
                _logger.LogWarning("No image was selected for upload.");
                return BadRequest("לא נבחרה תמונה");
            }
              

            // תיקייה בטוחה בתוך wwwroot
            var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");

            // יוצרים את התיקייה אם היא לא קיימת
            if (!Directory.Exists(uploadsFolder))
            {
                _logger.LogInformation("Uploads directory does not exist. Creating...");
                Directory.CreateDirectory(uploadsFolder);
            }

            // שם קובץ ייחודי כדי למנוע התנגשויות
            var fileName = Guid.NewGuid() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            // שמירה על הקובץ
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                _logger.LogInformation("Saving uploaded image to {FilePath}", filePath);
                await image.CopyToAsync(stream);
            }

            // מחזירים URL לשימוש ב־Angular
            var fileUrl = $"/uploads/{fileName}";
            return Ok(new { fileUrl });
        }
    }
}
