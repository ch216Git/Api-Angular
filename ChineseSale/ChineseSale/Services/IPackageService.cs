using ChineseSale.Dtos;

namespace ChineseSale.Services
{
    public interface IPackageService
    {
        Task<IEnumerable<GetPackageDto>> GetAllPackageAsync();
        Task<GetPackageDto?> GetPackageByIdAsync(int Id);
        Task<GetPackageDto> CreatePackageAsync(CreatePackageDto packageDto);
        Task<GetPackageDto> UpdatePackageAsync(UpdatePackageDto packageDto);
        Task<bool> DeletePackageAsync(int Id);
    }
}
