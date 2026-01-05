using ChineseSale.Data;
using ChineseSale.Models;
using Microsoft.EntityFrameworkCore;

namespace ChineseSale.Repositories
{
    public class OrderRepository:IOrderRepository
    {
        private readonly ChineseSaleContextDB _context;
        public OrderRepository(ChineseSaleContextDB context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return await _context.Orders
                .Include(o => o.User)
                .ToListAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(int Id)
        {
            return await _context.Orders
                .Include(o => o.User)
                 .FirstOrDefaultAsync(c => c.Id == Id);
        }
        public async Task<Order?> GetOrderByUserIdAsync(int UserId)
        {
            return await _context.Orders
                .Include(o => o.User)
                 .FirstOrDefaultAsync(c => c.UserId == UserId);
        }
        public async Task<Order> CreateOrderAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }
    }
}
