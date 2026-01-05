using ChineseSale.Data;
using ChineseSale.Models;
using Microsoft.EntityFrameworkCore;

namespace ChineseSale.Repositories
{
    public class PrizeRepository:IPrizeRepository
    {
        private readonly ChineseSaleContextDB _context;
        public PrizeRepository(ChineseSaleContextDB context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Prize>> GetAllPrizeAsync()
        {
            return await _context.Prizes
                .Include(p=>p.Gift)
                .Include(p=>p.User)
                .ToListAsync();
        }

        public async Task<Prize?> GetPrizeByIdAsync(int Id)
        {
            return await _context.Prizes
                  .Include(p => p.Gift)
                  .Include(p => p.User)
                  .FirstOrDefaultAsync(p => p.Id == Id);
        }
        public async Task<Prize?> GetPrizeByUserIdAsync(int UserId)
        {
            return await _context.Prizes
                  .Include(p => p.Gift)
                  .Include(p => p.User)
                  .FirstOrDefaultAsync(p => p.UserId == UserId);
        }
        public async Task<Prize> CreatePrizeAsync(Prize prize)
        {
            _context.Prizes.Add(prize);
            await _context.SaveChangesAsync();
            return prize;
        }
    }
}
