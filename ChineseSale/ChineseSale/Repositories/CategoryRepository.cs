using ChineseSale.Data;
using ChineseSale.Models;
using Microsoft.EntityFrameworkCore;

namespace ChineseSale.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ChineseSaleContextDB _context;
        public CategoryRepository(ChineseSaleContextDB context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Category>> GetAllCategoryAsync()
        {
            return await _context.Categorys
                .Include(c=>c.Gifts)
                .ToListAsync();
        }
        public async Task<Category?> GetCategoryByIdAsync(int Id)
        {
            return await _context.Categorys
                .Include(c => c.Gifts)
                .ThenInclude(g => g.Donor)
                .FirstOrDefaultAsync(c => c.Id == Id);
        }
        public async Task<Category> CreateCategoryAsync(Category category)
        {
            _context.Categorys.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }
        public async Task<Category> UpdateCategoryAsync(Category category)
        {
            _context.Categorys.Update(category);
            await _context.SaveChangesAsync();
            return category;
        }
        public async Task DeleteCategoryAsync(Category category)
        {
            _context.Categorys.Remove(category);
            await _context.SaveChangesAsync();
        }
   
        public async Task<Category?> AddGiftToCategory(Gift gift,Category category)
        {
            category.Gifts.Add(gift);
            _context.Categorys.Update(category);
            await _context.SaveChangesAsync();
            return category;
        }

    

        public async Task<Category?> DeleteGiftFromCategory(Gift gift, Category category)
        {
            category.Gifts.Remove(gift);
            _context.Categorys.Update(category);
            await _context.SaveChangesAsync();
            return category;
        }

      
    }
}
