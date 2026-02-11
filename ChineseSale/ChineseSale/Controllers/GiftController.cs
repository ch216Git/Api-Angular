using ChineseSale.Dtos;
using ChineseSale.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ChineseSale.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GiftController : ControllerBase
    {
        private readonly IGiftService _giftService;
        private readonly ILogger<GiftController> _logger;
        public GiftController(IGiftService giftService, ILogger<GiftController> logger)
        {
            _giftService = giftService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetGiftDto>>> GetAllGiftAsync()
        {
            _logger.LogInformation("Getting all gifts");
            var gifts = await _giftService.GetAllGiftAsync();
            return Ok(gifts);
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<GetGiftDto>> GetByIdGiftAsync(int Id)
        {
            _logger.LogInformation($"Getting gift with ID: {Id}");
            try
            {
                var gift = await _giftService.GetByIdGiftAsync(Id);
                _logger.LogInformation($"Successfully retrieved gift with ID: {Id}");
                return Ok(gift);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving gift with ID: {Id}");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Manager")]
        [HttpPost("Add")]
        public async Task<ActionResult<GetGiftDto>> CreateGiftAsync(CreateGiftDto giftDto)
        {
            _logger.LogInformation("Creating a new gift");
            try
            {
                var gift = await _giftService.CreateGiftAsync(giftDto);
                _logger.LogInformation("Gift created successfully");
                return Ok(gift);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating gift");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Manager")]
        [HttpPost("Update")]
        public async Task<ActionResult<GetGiftDto>> UpdateGiftAsync(UpdateGiftDto giftDto)
        {
            _logger.LogInformation($"Updating gift with ID: {giftDto.Id}");
            try
            {
                var gift = await _giftService.UpdateGiftAsync(giftDto);
                _logger.LogInformation($"Gift with ID: {giftDto.Id} updated successfully");
                return Ok(gift);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating gift with ID: {giftDto.Id}");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Manager")]
        [HttpDelete("{Id}")]
        public async Task<IActionResult> Delete(int Id)
        {
            _logger.LogInformation($"Deleting gift with ID: {Id}");
            try
            {
                bool result = await _giftService.DeleteGiftAsync(Id);
                if (result)
                {
                    _logger.LogInformation($"Gift with ID: {Id} deleted successfully");
                    return Ok("Gift deleted successfully");
                }
                else
                {
                    _logger.LogWarning($"Failed to delete gift with ID: {Id}");
                    return BadRequest("Failed to delete gift");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting gift with ID: {Id}");
                return BadRequest(ex.Message);
            }
        }
        
        [HttpGet("Exists/{Name}")]
        public async Task<ActionResult<IEnumerable<GetGiftDto>>> ExistsGiftAsync(string Name)
        {
            _logger.LogInformation($"Checking existence of gifts with Name: {Name}");
            var gifts = await _giftService.ExistsGiftAsync(Name);
            return Ok(gifts);
        }

        [HttpGet("SortByPrice")]
        public async Task<ActionResult<IEnumerable<GetGiftDto>>> SortGiftByPriceAsync()
        {
            _logger.LogInformation("Sorting gifts by price");
            var gifts = await _giftService.SortGiftByPriceAsync();
            return Ok(gifts);
        }

        [HttpGet("SortByBuyer")]
        public async Task<ActionResult<IEnumerable<GetGiftDto>>> SortGiftByBuyerAsync()
        {
            _logger.LogInformation("Sorting gifts by buyer");
            var gifts = await _giftService.SortGiftByBuyerAsync();
            return Ok(gifts);
        }

        [HttpGet("ExistsDonorName/{donor}")]
        public async Task<ActionResult<GetDonorDto>> ExistsDonorAsync(string donor)
        {
            _logger.LogInformation($"Checking existence of donor with name: {donor}");
            var donors = await _giftService.ExistsDonorAsync(donor);
            return Ok(donors);
        }

        [HttpGet("existsSum/{sum}")]
        public async Task<ActionResult<GetDonorDto>> SumCostumer(int sum)
        {
            _logger.LogInformation($"Checking existence of donor with sum: {sum}");
            var donors = await _giftService.ExistsSumAsync(sum);
            return Ok(donors);
        }
    }
}
