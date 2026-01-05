using ChineseSale.Models;

namespace ChineseSale.Repositories
{
    public interface IPackageRepository
    {
        Task<IEnumerable<Package>> GetAllPackageAsync();
        Task<Package?> GetPackageByIdAsync(int Id);
        Task<Package> CreatePackageAsync(Package package);
        Task<Package> UpdatePackageAsync(Package package);   
        Task DeletePackageAsync(Package package);
    }
}
