using ChineseSale.Dtos;
using ChineseSale.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChineseSale.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackageController : ControllerBase
    {
        private readonly IPackageService _packageService;
        public PackageController(IPackageService packageService)
        {
            _packageService = packageService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetPackageDto>>> GetAllPackageAsync()
        {
            var packages = await _packageService.GetAllPackageAsync();
            return Ok(packages);
        }
        [HttpGet("{Id}")]
        public async Task<ActionResult<GetPackageDto>> GetPackageByIdAsync(int Id)
        {
            try
            {
                var package = await _packageService.GetPackageByIdAsync(Id);
                return Ok(package);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Add")]
        public async Task<ActionResult<GetPackageDto>> CreatePackageAsync(CreatePackageDto packageDto)
        {
            try
            {
                var package = await _packageService.CreatePackageAsync(packageDto);
                return Ok(package);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Update")]
        public async Task<ActionResult<GetPackageDto>> UpdatePackageAsync(UpdatePackageDto packageDto)
        {
            try
            {
                var package = await _packageService.UpdatePackageAsync(packageDto);
                return Ok(package);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{Id}")]
        public async Task<IActionResult> Delete(int Id)
        {
           try
            {
            bool result = await _packageService.DeletePackageAsync(Id);
            if (result)
                return Ok("Package deleted successfully");
            else
                return BadRequest("Failed to delete package");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
