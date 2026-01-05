using ChineseSale.Models;

namespace ChineseSale.Repositories
{
    public interface IGiftRepository
    {
        Task<IEnumerable<Gift>> GetAllGiftAsync();
        Task<Gift?> GetByIdGiftAsync(int Id);
        Task<Gift> CreateGiftAsync(Gift gift);
        Task<Gift> UpdateGiftAsync(Gift gift);   
        Task DeleteGiftAsync(Gift gift);
        Task<IEnumerable<Gift?>> ExistsGiftAsync(string Name);
    }
}
