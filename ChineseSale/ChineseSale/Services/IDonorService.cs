using ChineseSale.Dtos;
using ChineseSale.Models;
namespace ChineseSale.Services
{
    public interface IDonorService
    {
        Task<IEnumerable<GetDonorDto>> GetAllDonorAsync();
        Task<GetDonorByIdDto?> GetDonorByIdAsync(int Id);
        Task<GetDonorDto> CreateDonorAsync(CreateDonorDto donorDto);
        Task<GetDonorByIdDto> UpdateDonorAsync(UpdateDonorDto donorDto);
        Task<bool> DeleteDonorAsync(int Id);
        Task<IEnumerable<GetDonorDto>> GetSearchByNameDonorAsync(string str);
        Task<IEnumerable<GetDonorDto>> GetSearchByEmailDonorAsync(string str);
        Task<IEnumerable<GetDonorDto>> GetSearchByGiftDonorAsync(string str);
    }
}
