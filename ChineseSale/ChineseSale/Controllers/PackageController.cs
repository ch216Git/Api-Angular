using ChineseSale.Dtos;
using ChineseSale.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ChineseSale.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackageController : ControllerBase
    {
        private readonly IPackageService _packageService;
        private readonly ILogger<PackageController> _logger;

        public PackageController(IPackageService packageService, ILogger<PackageController> logger)
        {
            _packageService = packageService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetPackageDto>>> GetAllPackageAsync()
        {
            _logger.LogInformation("Fetching all packages...");
            var packages = await _packageService.GetAllPackageAsync();
            return Ok(packages);
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<GetPackageDto>> GetPackageByIdAsync(int Id)
        {
            _logger.LogInformation($"Fetching package with ID: {Id}");
            try
            {
                var package = await _packageService.GetPackageByIdAsync(Id);
                _logger.LogInformation($"Successfully retrieved package with ID: {Id}");
                return Ok(package);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving package with ID: {Id}");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Manager")]
        [HttpPost("Add")]
        public async Task<ActionResult<GetPackageDto>> CreatePackageAsync(CreatePackageDto packageDto)
        {
            _logger.LogInformation("Creating a new package...");
            try
            {
                var package = await _packageService.CreatePackageAsync(packageDto);
                _logger.LogInformation("Package created successfully");
                return Ok(package);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating package");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Manager")]
        [HttpPost("Update")]
        public async Task<ActionResult<GetPackageDto>> UpdatePackageAsync(UpdatePackageDto packageDto)
        {
            _logger.LogInformation($"Updating package with ID: {packageDto.Id}");
            try
            {
                var package = await _packageService.UpdatePackageAsync(packageDto);
                _logger.LogInformation("Package updated successfully");
                return Ok(package);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating package with ID: {packageDto.Id}");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Manager")]
        [HttpDelete("{Id}")]
        public async Task<IActionResult> Delete(int Id)
        {
            _logger.LogInformation($"Deleting package with ID: {Id}");
            try
            {
                bool result = await _packageService.DeletePackageAsync(Id);
                if (result)
                {
                    _logger.LogInformation($"Package with ID: {Id} deleted successfully");
                    return Ok("Package deleted successfully");
                }
                else
                {
                    _logger.LogWarning($"Failed to delete package with ID: {Id}");
                    return BadRequest("Failed to delete package");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting package with ID: {Id}");
                return BadRequest(ex.Message);
            }
        }
    }
}
