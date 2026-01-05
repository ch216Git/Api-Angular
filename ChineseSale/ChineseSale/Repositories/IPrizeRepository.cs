using ChineseSale.Models;

namespace ChineseSale.Repositories
{
    public interface IPrizeRepository
    {
        Task<IEnumerable<Prize>> GetAllPrizeAsync();
        Task<Prize?> GetPrizeByIdAsync(int Id);
        Task<Prize?> GetPrizeByUserIdAsync(int UserId);
        Task<Prize> CreatePrizeAsync(Prize prize);

    }
}
