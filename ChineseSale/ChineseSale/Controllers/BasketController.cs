using ChineseSale.Services;
using Microsoft.AspNetCore.Mvc;
using ChineseSale.Dtos;

namespace ChineseSale.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BasketController: ControllerBase
    {
        private readonly IBasketService _basketService;
        public BasketController(IBasketService basketService)
        {
            _basketService = basketService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetBasketDto>>> GetAllBasketsAsync()
        {
            var baskets = await _basketService.GetAllBasketAsync();
            return Ok(baskets);
        }
        [HttpGet("{Id}")]
        public async Task<ActionResult<GetBasketDto>> GetBasketByIdAsync(int Id)
        {
            try
            {
                var basket = await _basketService.GetBasketByIdAsync(Id);
                return Ok(basket);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("ByUserId/{UserId}")]
        public async Task<ActionResult<GetBasketDto>> GetBasketByUserIdAsync(int UserId)
        {
            try
            {
                var basket = await _basketService.GetBasketByUserIdAsync(UserId);
                return Ok(basket);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Add")]
        public async Task<ActionResult<GetBasketDto>> CreateBasketAsync(CreateBasketDto basketDto)
        {
            try
            {
                var basket = await _basketService.CreateBasketAsync(basketDto);
                return Ok(basket);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("Delete")]
        public async Task<IActionResult> DeleteBasketAsync(int Id)
        {
            try
            {
                bool result = await _basketService.DeleteBasketAsync(Id);
                if (result)
                    return Ok("Basket item deleted successfully");
                else
                    return BadRequest("Failed to delete basket item");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("AddToBasket")]
        public async Task<ActionResult<GetBasketDto>> AddToBasketAsync(AddGiftToBasketDto addToBasketDto)
        {
            try
            {
                var basket = await _basketService.AddGiftToBasket(addToBasketDto);
                return Ok(basket);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("RemoveFromBasket")]
        public async Task<ActionResult<GetBasketDto>> RemoveFromBasketAsync(DeleteGiftFromBasketDto removeFromBasketDto)
        {
            try
            {
                var basket = await _basketService.DeleteGiftFromBasket(removeFromBasketDto);
                return Ok(basket);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
