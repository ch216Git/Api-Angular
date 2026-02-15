using ChineseSale.Dtos;
using ChineseSale.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ChineseSale.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrizeController : ControllerBase
    {
        private readonly IPrizeService _prizeService;
        private readonly ILogger<PrizeController> _logger;

        public PrizeController(IPrizeService prizeService, ILogger<PrizeController> logger)
        {
            _prizeService = prizeService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetPrizeDto>>> GetAllPrizeAsync()
        {
            _logger.LogInformation("Getting all prizes");
            var prizes = await _prizeService.GetAllPrizeAsync();
            return Ok(prizes);
        }
        [HttpGet("export")]
        public async Task<IActionResult> ExportPrizes()
        {

            var filePath = await _prizeService.ExportPrizesToCsvAsync();

            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);

            return File(fileBytes, "text/csv", "PrizesReport.csv");
        }
        [HttpGet("{Id}")]
        public async Task<ActionResult<GetPrizeDto>> GetPrizeByIdAsync(int Id)
        {
            _logger.LogInformation($"Enter to function get prize with ID: {Id}");
            try
            {
                var prize = await _prizeService.GetPrizeByIdAsync(Id);
                _logger.LogInformation($"Successfully retrieved prize with ID: {Id}");
                return Ok(prize);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving prize with ID: {Id}");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("user/{UserId}")]
        public async Task<IActionResult> GetPrizeByUserIdAsync(int UserId)
        {
            _logger.LogInformation($"Enter to function get prize with UserID: {UserId}");
            try
            {
                GetPrizeDto prize = await _prizeService.GetPrizeByUserIdAsync(UserId);
                _logger.LogInformation($"Successfully retrieved prize for UserID: {UserId}");
                return Ok(prize);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving prize for UserID: {UserId}");
                return BadRequest(ex.Message);
            }
        }

        //[HttpPost("Add")]
        //public async Task<ActionResult<GetPrizeDto>> CreatePrizeAsync(CreatePrizeDto prizeDto)
        //{
        //    try
        //    {
        //        var prize = await _prizeService.CreatePrizeAsync(prizeDto);
        //        return Ok(prize);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        [Authorize(Roles = "Manager")]
        [HttpPost("SelectRandomPrize/{giftId}")]
        public async Task<IActionResult> SelectRandomPrize(int giftId)
        {
            _logger.LogInformation($"Enter to function select random prize for GiftID: {giftId}");
            try
            {
                var prize = await _prizeService.SelectRandomPrize(giftId);
                _logger.LogInformation($"Successfully selected random prize for GiftID: {giftId}");
                return Ok(prize);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error selecting random prize for GiftID: {giftId}");
                return BadRequest(ex.Message);
            }
        }
    }
}
