using Microsoft.AspNetCore.Mvc;
using ChineseSale.Services;
using ChineseSale.Dtos;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace ChineseSale.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonorController : ControllerBase
    {
        private readonly IDonorService _donorService;
        private readonly ILogger<DonorController> _logger;

        public DonorController(IDonorService donorService, ILogger<DonorController> logger)
        {
            _donorService = donorService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetDonorDto>>> GetAllDonorAsync()
        {
            var donors = await _donorService.GetAllDonorAsync();
            _logger.LogInformation("Getting all donors");
            return Ok(donors);
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<GetDonorByIdDto>> GetDonorByIdAsync(int Id)
        {
            _logger.LogInformation($"Enter to func get donor with ID: {Id}");
            try
            {
                var donor = await _donorService.GetDonorByIdAsync(Id);
                _logger.LogInformation($"Successfully retrieved donor with ID: {Id}");
                return Ok(donor);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving donor with ID: {Id}");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Manager")]
        [HttpPost("Add")]
        public async Task<ActionResult<GetDonorDto>> CreateDonorAsync(CreateDonorDto donorDto)
        {
            _logger.LogInformation("Entering to func Create a new donor");
            try
            {
                var donor = await _donorService.CreateDonorAsync(donorDto);
                _logger.LogInformation("Donor created successfully");
                return Ok(donor);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating donor");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Manager")]
        [HttpPost("Update")]
        public async Task<ActionResult<GetDonorByIdDto>> UpdateDonorAsync(UpdateDonorDto donorDto)
        {
            _logger.LogInformation("Entering to func Update a donor");
            try
            {
                var donor = await _donorService.UpdateDonorAsync(donorDto);
                _logger.LogInformation("Donor updated successfully");
                return Ok(donor);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating donor");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Manager")]
        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(int Id)
        {
            _logger.LogInformation($"Entering to func delete donor with ID: {Id}");
            try
            {
                bool result = await _donorService.DeleteDonorAsync(Id);
                if (result)
                {
                    _logger.LogInformation($"Donor with ID: {Id} deleted successfully");
                    return Ok("Donor deleted successfully");
                }
                else
                {
                    _logger.LogWarning($"Failed to delete donor with ID: {Id}");
                    return BadRequest("Failed to delete donor");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting donor with ID: {Id}");
                return BadRequest(ex.Message);
            }
        }

        // New methods added in the latest version
        [HttpGet("SearchByName")]
        public async Task<ActionResult<IEnumerable<GetDonorDto>>> GetSearchByNameDonorAsync(string str)
        {
            try
            {
                var donors = await _donorService.GetSearchByNameDonorAsync(str);
                return Ok(donors);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("SearchByEmail")]
        public async Task<ActionResult<IEnumerable<GetDonorDto>>> GetSearchByEmailDonorAsync(string str)
        {
            try
            {
                var donors = await _donorService.GetSearchByEmailDonorAsync(str);
                return Ok(donors);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("SearchByGift")]
        public async Task<ActionResult<IEnumerable<GetDonorDto>>> GetSearchByGiftDonorAsync(string str)
        {
            try
            {
                var donors = await _donorService.GetSearchByGiftDonorAsync(str);
                return Ok(donors);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
