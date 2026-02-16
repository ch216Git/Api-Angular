using ChineseSale.Dtos;
using ChineseSale.Models;

namespace ChineseSale.Services
{
    public interface IPrizeService
    {
        Task<IEnumerable<GetPrizeDto>> GetAllPrizeAsync();
        Task<GetPrizeDto?> GetPrizeByIdAsync(int Id);
        Task<GetPrizeDto?> GetPrizeByUserIdAsync(int UserId);
        Task<GetPrizeDto> CreatePrizeAsync(CreatePrizeDto prizeDto);
        Task<GetPrizeDto> SelectRandomPrize(int giftId);
       
        Task<string> ExportPrizesToCsvAsync();
    }
}
