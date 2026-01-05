using ChineseSale.Dtos;
using ChineseSale.Models;

namespace ChineseSale.Services
{
    public interface IGiftService
    {
        Task<IEnumerable<GetGiftDto>> GetAllGiftAsync();
        Task<GetGiftDto?> GetByIdGiftAsync(int Id);
        Task<GetGiftDto> CreateGiftAsync(CreateGiftDto giftDto);
        Task<GetGiftDto> UpdateGiftAsync(UpdateGiftDto giftDto);
        Task<bool> DeleteGiftAsync(int Id);
        Task<IEnumerable<GetGiftDto?>> ExistsGiftAsync(string Name);
    }
}
