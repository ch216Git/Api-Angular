using ChineseSale.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ChineseSale.Dtos;
using Microsoft.Extensions.Logging;

namespace ChineseSale.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BasketController : ControllerBase
    {
        private readonly IBasketService _basketService;
        private readonly ILogger<BasketController> _logger;

        public BasketController(IBasketService basketService, ILogger<BasketController> logger)
        {
            _basketService = basketService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetBasketDto>>> GetAllBasketsAsync()
        {
            _logger.LogInformation("Getting all baskets");
            var baskets = await _basketService.GetAllBasketAsync();
            return Ok(baskets);
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<GetBasketDto>> GetBasketByIdAsync(int Id)
        {
            try
            {
                _logger.LogInformation($"Getting basket with ID: {Id}");
                var basket = await _basketService.GetBasketByIdAsync(Id);
                return Ok(basket);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving basket with ID: {Id}");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ByUserId/{UserId}")]
        public async Task<ActionResult<GetBasketDto>> GetBasketByUserIdAsync(int UserId)
        {
            try
            {
                _logger.LogInformation($"Getting basket for User ID: {UserId}");
                var basket = await _basketService.GetBasketByUserIdAsync(UserId);
                return Ok(basket);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving basket for User ID: {UserId}");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("Add")]
        public async Task<ActionResult<GetBasketDto>> CreateBasketAsync(CreateBasketDto basketDto)
        {
            try
            {
                _logger.LogInformation("Creating a new basket");
                var basket = await _basketService.CreateBasketAsync(basketDto);
                _logger.LogInformation("Basket created successfully");
                return Ok(basket);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating basket");
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> DeleteBasketAsync(int Id)
        {
            try
            {
                _logger.LogInformation($"Deleting basket with ID: {Id}");
                bool result = await _basketService.DeleteBasketAsync(Id);
                if (result)
                {
                    _logger.LogInformation($"Basket with ID: {Id} deleted successfully");
                    return Ok("Basket item deleted successfully");
                }
                else
                {
                    _logger.LogWarning($"Failed to delete basket with ID: {Id}");
                    return BadRequest("Failed to delete basket item");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting basket with ID: {Id}");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("AddGiftToBasket")]
        public async Task<ActionResult<GetBasketDto>> AddToBasketAsync(AddGiftToBasketDto addToBasketDto)
        {
            try
            {
                _logger.LogInformation("Adding gift to basket");
                var basket = await _basketService.AddGiftToBasket(addToBasketDto);
                _logger.LogInformation("Gift added to basket successfully");
                return Ok(basket);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding gift to basket");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("RemoveGiftFromBasket")]
        public async Task<ActionResult<GetBasketDto>> RemoveFromBasketAsync(DeleteGiftFromBasketDto removeFromBasketDto)
        {
            try
            {
                _logger.LogInformation("Removing gift from basket");
                var basket = await _basketService.DeleteGiftFromBasket(removeFromBasketDto);
                _logger.LogInformation("Gift removed from basket successfully");
                return Ok(basket);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing gift from basket");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("AddPackageToBasket")]
        public async Task<ActionResult<GetBasketDto>> AddPackageToBasket(AddPackageToBasketDto addPackageToBasketDto)
        {
            try
            {
                _logger.LogInformation("Adding package to basket");
                var basket = await _basketService.AddPackageToBasket(addPackageToBasketDto);
                _logger.LogInformation("Package added to basket successfully");
                return Ok(basket);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding package to basket");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("RemovePackageFromBasket")]
        public async Task<ActionResult<GetBasketDto>> RemovePackageFromBasketAsync(DeletePackageFromBasketDto removePackageFromBasketDto)
        {
            try
            {
                _logger.LogInformation("Removing package from basket");
                var basket = await _basketService.DeletePackageFromBasket(removePackageFromBasketDto);
                _logger.LogInformation("Package removed from basket successfully");
                return Ok(basket);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing package from basket");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("RemoveAllPackageFromBasket")]
        public async Task<ActionResult<GetBasketDto>> RemoveAllPackageFromBasketAsync(DeletePackageFromBasketDto removePackageFromBasketDto)
        {
            try
            {
                _logger.LogInformation("Removing all packages from basket");
                var basket = await _basketService.DeleteAllPackageFromBasket(removePackageFromBasketDto);
                _logger.LogInformation("All packages removed from basket successfully");
                return Ok(basket);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing all packages from basket");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("RemoveAllGiftFromBasket")]
        public async Task<ActionResult<GetBasketDto>> RemoveAllGiftFromBasketAsync(DeleteGiftFromBasketDto removeGiftFromBasketDto)
        {
            try
            {
                _logger.LogInformation("Removing all gifts from basket");
                var basket = await _basketService.DeleteAllGiftFromBasket(removeGiftFromBasketDto);
                _logger.LogInformation("All gifts removed from basket successfully");
                return Ok(basket);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing all gifts from basket");
                return BadRequest(ex.Message);
            }
        }
    }
}
