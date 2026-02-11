using ChineseSale.Data;
using ChineseSale.Models;
using Microsoft.EntityFrameworkCore;

namespace ChineseSale.Repositories
{
    public class DonorRepository : IDonorRepository
    {
        private readonly ChineseSaleContextDB _context;
        public DonorRepository(ChineseSaleContextDB context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Donor>> GetAllDonorAsync()
        {
            return await _context.Donors
                  .ToListAsync();
        }

        public async Task<Donor?> GetDonorByIdAsync(int Id)
        {
            return await _context.Donors
             .Include(c => c.Gifts)
             .ThenInclude(g => g.Category)
             .FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<Donor> CreateDonorAsync(Donor donor)
        {
            _context.Donors.Add(donor);
            await _context.SaveChangesAsync();
            return donor;
        }
        public async Task<Donor> UpdateDonorAsync(Donor donor)
        {
            _context.Donors.Update(donor);
            await _context.SaveChangesAsync();
            return donor;
        }
        public async Task DeleteDonorAsync(Donor donor)
        {
            _context.Donors.Remove(donor);
            await _context.SaveChangesAsync();
        }

        public async Task<Donor?> AddGiftToDonor(Gift gift, Donor donor)
        {
            donor.Gifts.Add(gift);
            _context.Donors.Update(donor);
            await _context.SaveChangesAsync();
            return donor;
        }
        public async Task<Donor?> DeleteGiftFromDonor(Gift gift, Donor donor)
        {
            donor.Gifts.Remove(gift);
            _context.Donors.Update(donor);
            await _context.SaveChangesAsync();
            return donor;
        }
        public async Task<IEnumerable<Donor?>> GetSearchByNameDonorAsync(string str)
        {
            return await _context.Donors
                .Where(d => d.Name.ToLower().Contains(str.ToLower()))
                  .ToListAsync();
        }
        public async Task<IEnumerable<Donor?>> GetSearchByEmailDonorAsync(string str)
        {
            return await _context.Donors
               .Where(d => d.Email.ToLower().Contains(str.ToLower()))
                  .ToListAsync();
        }
        public async Task<IEnumerable<Donor?>> GetSearchByGiftDonorAsync(string str)
        {
            return await _context.Donors
                .Where(d => d.Gifts.Any(g => g.Name.ToLower().Contains(str.ToLower())))
                  .ToListAsync();
        }
    }
}
