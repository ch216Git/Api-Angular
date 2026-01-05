using ChineseSale.Models;

namespace ChineseSale.Repositories
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllCategoryAsync();
        Task<Category?> GetCategoryByIdAsync(int Id);
        Task<Category> CreateCategoryAsync(Category category);
        Task<Category> UpdateCategoryAsync(Category category);
        Task DeleteCategoryAsync(Category category);
        Task<Category?> AddGiftToCategory(Gift gift,Category category);
        Task<Category?> DeleteGiftFromCategory(Gift gift, Category category);

    }
}
