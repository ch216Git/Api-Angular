using ChineseSale.Dtos;
using ChineseSale.Models;

namespace ChineseSale.Services
{
    public interface IOrderService
    {
        Task<IEnumerable<GetOrderDto>> GetAllOrderAsync();
        Task<GetOrderByIdDto?> GetOrderByIdAsync(int Id);
        Task<GetOrderByIdDto?> GetOrderByUserIdAsync(int UserId);
        Task<GetOrderByIdDto> CreateOrderAsync(CreatOrdeDto orderDto);
        Task<IEnumerable<GetUserDto>> GetBuyerGift(int GiftId);

    }
}