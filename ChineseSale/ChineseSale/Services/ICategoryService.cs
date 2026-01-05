using ChineseSale.Dtos;
using ChineseSale.Models;

namespace ChineseSale.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<GetCategoryDto>> GetAllCategoryAsync();
        Task<GetCategoryByIdDto?> GetCategoryByIdAsync(int Id);
        Task<GetCategoryDto> CreateCategoryAsync(CreateCategorDto categoryDto);
        Task<GetCategoryByIdDto> UpdateCategoryAsync(UpdateCategoryDto categoryDto);
        Task<bool> DeleteCategoryAsync(int Id);
    }
}
