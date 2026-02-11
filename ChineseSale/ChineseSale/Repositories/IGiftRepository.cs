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
        Task<IEnumerable<Gift?>> SortGiftByPriceAsync();
        Task<IEnumerable<Gift?>> SortGiftByBuyerAsync();
        Task<IEnumerable<Gift?>> ExistsDonorAsync(string donor);
        Task<IEnumerable<Gift?>> ExistsSumAsync(int sumCustumer);

    }
}
