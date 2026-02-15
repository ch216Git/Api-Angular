using ChineseSale.Dtos;
using ChineseSale.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChineseSale.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILogger<OrderController> _logger;

        public OrderController(IOrderService orderService, ILogger<OrderController> logger)
        {
            _orderService = orderService;
            _logger = logger;
        }

        //[Authorize(Roles = "Manager")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetOrderDto>>> GetAllOrderAsync()
        {
            var orders = await _orderService.GetAllOrderAsync();
            _logger.LogInformation("Getting all orders");
            return Ok(orders);
        }

        [Authorize]
        [HttpGet("{Id}")]
        public async Task<ActionResult<GetOrderByIdDto>> GetOrderByIdAsync(int Id)
        {
            var role = User.Claims.First(c => c.Type == ClaimTypes.Role).Value;
            if (Id != GetUserIdFromToken() && role != "Manager")
            {
                return Forbid("You are not authorized to access this order.");
            }
            _logger.LogInformation($"Entering function to get order with ID: {Id}");
            try
            {
                var order = await _orderService.GetOrderByIdAsync(Id);
                _logger.LogInformation($"Successfully retrieved order with ID: {Id}");
                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving order with ID: {Id}");
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("user/{UserId}")]
        public async Task<IActionResult> GetOrderByUserIdAsync(int UserId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
            var role = User.Claims.First(c => c.Type == ClaimTypes.Role).Value;

            if (userIdClaim == null)
            {
                return Unauthorized("UserId not found in token");
            }

            var userID = int.Parse(userIdClaim.Value);
            if (userID != UserId && role != "Manager")
            {
                return Forbid("You are not authorized to access this order.");
            }
            var order = await _orderService.GetOrderByUserIdAsync(UserId);
            _logger.LogInformation($"Successfully retrieved order for UserID: {UserId}");
            return Ok(order);
        }

        [Authorize]
        [HttpPost("Add")]
        public async Task<ActionResult<GetOrderByIdDto>> CreateOrderAsync(CreatOrdeDto orderDto)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                   ?? User.FindFirst("id")?.Value;

            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var userID = int.Parse(userIdClaim);
            if (userID != orderDto.UserId)
            {
                return Forbid("You are not authorized to access this order.");
            }

            _logger.LogInformation("Entering function to create a new order");
            try
            {
                var order = await _orderService.CreateOrderAsync(orderDto);
                _logger.LogInformation("Order created successfully");
                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order");
                return BadRequest(ex.Message);
            }
        }

        //[Authorize(Roles = "Manager")]
        [HttpGet("gift/{giftId}/buyers")]
        public async Task<IActionResult> GetBuyerGift(int giftId)
        {
            var buyers = await _orderService.GetBuyerGift(giftId);
            _logger.LogInformation($"Successfully retrieved buyers for GiftID: {giftId}");
            return Ok(buyers);
        }

        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User ID claim missing");

            return int.Parse(userIdClaim.Value);
        }
    }
}
