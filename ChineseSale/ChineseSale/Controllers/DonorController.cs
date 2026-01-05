using Microsoft.AspNetCore.Mvc;
using ChineseSale.Services;
using ChineseSale.Dtos;
using System.Threading.Tasks;

namespace ChineseSale.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonorController : ControllerBase

    {
        private readonly IDonorService _donorService;
        public DonorController(IDonorService donorService)
        {
            _donorService = donorService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetDonorDto>>> GetAllDonorAsync()
        {
            var donors = await _donorService.GetAllDonorAsync();
            return Ok(donors);
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<GetDonorByIdDto>> GetDonorByIdAsync(int Id)
        {
            try
            {
                var donor = await _donorService.GetDonorByIdAsync(Id);
                return Ok(donor);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("Add")]
        public async Task<ActionResult<GetDonorDto>> CreateDonorAsync(CreateDonorDto donorDto)
        {
            try
            {
                var donor = await _donorService.CreateDonorAsync(donorDto);
                return Ok(donor);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("Update")]
        public async Task<ActionResult<GetDonorByIdDto>> UpdateDonorAsync(UpdateDonorDto donorDto)
        {
            try
            {
                var donor = await _donorService.UpdateDonorAsync(donorDto);
                return Ok(donor);
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
                bool result = await _donorService.DeleteDonorAsync(Id);
                if (result)
                    return Ok("Donor deleted successfully");
                else
                    return BadRequest("Failed to delete donor");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
