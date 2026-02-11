using ChineseSale.Dtos;
using ChineseSale.Services;
using Microsoft.AspNetCore.Mvc;

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
            var gifts = await _giftService.GetAllGiftAsync();
            _logger.LogInformation("Getting all gifts");
            return Ok(gifts);
        }
        [HttpGet("{Id}")]
        public async Task<ActionResult<GetGiftDto>> GetByIdGiftAsync(int Id)
        {
            try
            {
                var gift = await _giftService.GetByIdGiftAsync(Id);
                return Ok(gift);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Add")]
        public async Task<ActionResult<GetGiftDto>> CreateGiftAsync(CreateGiftDto giftDto)
        {
            try
            {
                var gift = await _giftService.CreateGiftAsync(giftDto);
                return Ok(gift);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Update")]
        public async Task<ActionResult<GetGiftDto>> UpdateGiftAsync(UpdateGiftDto giftDto)
        {
            try
            {
                var gift = await _giftService.UpdateGiftAsync(giftDto);
                return Ok(gift);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(int Id)
        {
            try
            {
                bool result = await _giftService.DeleteGiftAsync(Id);
                if (result)
                    return Ok("gift deleted successfully");
                else
                    return BadRequest("Failed to delete gift");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpGet("Exists/{Name}")]
        public async Task<ActionResult<IEnumerable<GetGiftDto>>> ExistsGiftAsync(string Name)
        {

            var gifts = await _giftService.ExistsGiftAsync(Name);
            return Ok(gifts);
        }
        [HttpGet("SortByPrice")]
        public async Task<ActionResult<IEnumerable<GetGiftDto>>> SortGiftByPriceAsync()
        {
            var gifts = await _giftService.SortGiftByPriceAsync();
            return Ok(gifts);
        }
        [HttpGet("SortByBuyer")]
        public async Task<ActionResult<IEnumerable<GetGiftDto>>> SortGiftByBuyerAsync()
        {
            var gifts = await _giftService.SortGiftByBuyerAsync();
            return Ok(gifts);

        }
        [HttpGet("ExistsDonorName/{donor}")]
        public async Task<ActionResult<GetDonorDto>> ExistsDonorAsync(string donor)
        {
            var donors = await _giftService.ExistsDonorAsync(donor);
            _logger.LogInformation("Getting All Gift");
            return Ok(donors);
        }
        [HttpGet("existsSum/{sum}")]
        public async Task<ActionResult<GetDonorDto>> sumCostumer(int sum)
        {
            var donors = await _giftService.ExistsSumAsync(sum);
            _logger.LogInformation("Getting All Gift");
            return Ok(donors);
        }

    }
}
