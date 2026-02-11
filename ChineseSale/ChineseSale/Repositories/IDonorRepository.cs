using ChineseSale.Models;
using System.Threading.Tasks;

namespace ChineseSale.Repositories
{
    public interface IDonorRepository
    {
        Task<IEnumerable<Donor>> GetAllDonorAsync();
        Task<Donor?> GetDonorByIdAsync(int Id);
        Task<Donor> CreateDonorAsync(Donor donor);
        Task<Donor> UpdateDonorAsync(Donor donor);
        Task DeleteDonorAsync(Donor donor);
        Task<Donor?> AddGiftToDonor(Gift gift, Donor donor);
        Task<Donor?> DeleteGiftFromDonor(Gift gift, Donor donor);
        Task<IEnumerable<Donor?>> GetSearchByEmailDonorAsync(string str);
        Task<IEnumerable<Donor?>> GetSearchByNameDonorAsync(string str);
        Task<IEnumerable<Donor?>> GetSearchByGiftDonorAsync(string str);

    }
}
