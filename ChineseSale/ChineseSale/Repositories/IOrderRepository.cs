using ChineseSale.Models;
namespace ChineseSale.Repositories
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetAllOrdersAsync();
        Task<Order?> GetOrderByIdAsync(int Id);
        Task<Order?> GetOrderByUserIdAsync(int UserId);
        Task<Order> CreateOrderAsync(Order order);

    }
}
