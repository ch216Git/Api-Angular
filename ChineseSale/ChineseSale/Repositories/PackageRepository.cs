using ChineseSale.Data;
using ChineseSale.Models;
using Microsoft.EntityFrameworkCore;

namespace ChineseSale.Repositories
{
    public class PackageRepository : IPackageRepository
    {
        private readonly ChineseSaleContextDB _context;
        public PackageRepository(ChineseSaleContextDB context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Package>> GetAllPackageAsync()
        {
            return await _context.Packages
                  .ToListAsync();
        }

        public async Task<Package?> GetPackageByIdAsync(int Id)
        {
            return await _context.Packages
                 .FirstOrDefaultAsync(c => c.Id == Id);
        }
        public async Task<Package> CreatePackageAsync(Package package)
        {
            _context.Packages.Add(package);
            await _context.SaveChangesAsync();
            return package;
        }
        public async Task<Package> UpdatePackageAsync(Package package)
        {
            _context.Packages.Update(package);
            await _context.SaveChangesAsync();
            return package;
        }
        public async Task DeletePackageAsync(Package package)
        {
            _context.Packages.Remove(package);
            await _context.SaveChangesAsync();
        }
    }
}
