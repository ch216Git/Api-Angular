using ChineseSale.Dtos;
using ChineseSale.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChineseSale.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController: ControllerBase
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetOrderDto>>> GetAllOrderAsync()
        {
            var orders = await _orderService.GetAllOrderAsync();
            return Ok(orders);
        }
        [HttpGet("{Id}")]
        public async Task<ActionResult<GetOrderByIdDto>> GetOrderByIdAsync(int Id)
        {
            try
            {
                var order = await _orderService.GetOrderByIdAsync(Id);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("user/{UserId}")]
        public async Task<IActionResult> GetOrderByUserIdAsync(int UserId)
        {
            var order = await _orderService.GetOrderByUserIdAsync(UserId);
            return Ok(order);
        }
        [HttpPost("Add")]
        public async Task<ActionResult<GetOrderByIdDto>> CreateOrderAsync(CreatOrdeDto orderDto)
        {
            try
            {
                var order = await _orderService.CreateOrderAsync(orderDto);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("gift/{giftId}/buyers")]
        public async Task<IActionResult> GetBuyerGift(int giftId)
        {
            var buyers = await _orderService.GetBuyerGift(giftId);
            return Ok(buyers);
        }


    }
}
