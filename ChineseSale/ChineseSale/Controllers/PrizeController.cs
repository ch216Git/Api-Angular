using ChineseSale.Dtos;
using ChineseSale.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChineseSale.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrizeController: ControllerBase
    {
        private readonly IPrizeService _prizeService;
        public PrizeController(IPrizeService prizeService)
        {
            _prizeService = prizeService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetPrizeDto>>> GetAllPrizeAsync()
        {
            var prizes = await _prizeService.GetAllPrizeAsync();
            return Ok(prizes);
        }
        [HttpGet("export")]
        public async Task<IActionResult> ExportPrizes()
        {
            // יוצרים את קובץ ה-CSV
            var filePath = await _prizeService.ExportPrizesToCsvAsync();

            // קוראים את הקובץ לתוך זיכרון
            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);

            // מחזירים את הקובץ כהורדה למשתמש
            return File(fileBytes, "text/csv", "PrizesReport.csv");
        }
        [HttpGet("{Id}")]
        public async Task<ActionResult<GetPrizeDto>> GetPrizeByIdAsync(int Id)
        {
            try
            {
                var prize = await _prizeService.GetPrizeByIdAsync(Id);
                return Ok(prize);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("user/{UserId}")]
        public async Task<IActionResult> GetPrizeByUserIdAsync(int UserId)
        {
            try
            {
                GetPrizeDto prize = await _prizeService.GetPrizeByUserIdAsync(UserId);
                return Ok(prize);
            }
            catch (Exception ex)
            {
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
        [HttpPost("SelectRandomPrize/{giftId}")]
        public async Task<IActionResult> SelectRandomPrize(int giftId)
        {
            try
            {
                var prize = await _prizeService.SelectRandomPrize(giftId);
                return Ok(prize);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
