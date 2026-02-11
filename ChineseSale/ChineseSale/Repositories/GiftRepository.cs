using ChineseSale.Data;
using ChineseSale.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace ChineseSale.Repositories
{
    public class GiftRepository : IGiftRepository
    {
        private readonly ChineseSaleContextDB _context;
        public GiftRepository(ChineseSaleContextDB context)
        {
            _context=context;
        }
        public async Task<IEnumerable<Gift>> GetAllGiftAsync()
        {
            return await _context.Gifts
                 .Include(g => g.Category)
                 .Include(g=>g.Donor)
                 .ToListAsync();
        }
        public async Task<Gift?> GetByIdGiftAsync(int Id)
        {
             return await _context.Gifts
                .Include(g => g.Category)
                 .Include(g => g.Donor)
                 .FirstOrDefaultAsync(g=>g.Id==Id);
        }

        public async Task<Gift> CreateGiftAsync(Gift gift)
        {
            _context.Gifts.Add(gift);
            await _context.SaveChangesAsync();
            return gift;
        }

        public async Task DeleteGiftAsync(Gift gift)
        { 
            _context.Gifts.Remove(gift);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Gift?>> ExistsGiftAsync(string Name)
        {
            return await _context.Gifts
                .Where(g => g.Name.Trim().Contains(Name.Trim()))
                .Include(g => g.Category)
                .Include(g => g.Donor)
                .ToListAsync();
        }

        public async Task<Gift> UpdateGiftAsync(Gift gift)
        {
            _context.Gifts.Update(gift);
            await _context.SaveChangesAsync();
            return gift;
        }
        public async Task<IEnumerable<Gift>> SortGiftByPriceAsync()
        {
            return await _context.Gifts
                 .Include(g => g.Category)
                 .Include(g => g.Donor)
                 .OrderByDescending(g => g.Value)
                 .ToListAsync();
        }
        public async Task<IEnumerable<Gift?>> SortGiftByBuyerAsync()
        {
            return await _context.Gifts
                 .Include(g => g.Category)
                 .Include(g => g.Donor)
                 .OrderByDescending(g => g.SumCustomers)
                 .ToListAsync();
        }


        public async Task<IEnumerable<Gift?>> ExistsDonorAsync(string donor)
        {
            return await _context.Gifts
                 .Where(g => g.Donor.Name.Trim().Contains(donor.Trim()))
                .Include(g => g.Category)
                .Include(g => g.Donor)
                .ToListAsync();
        }
        public async Task<IEnumerable<Gift?>> ExistsSumAsync(int sumCustumer)
        {
            return await _context.Gifts
                           .Where(g => g.SumCustomers == sumCustumer)
                           .Include(g => g.Category)
                           .Include(g => g.Donor)
                           .ToListAsync();
        }


    }
}
