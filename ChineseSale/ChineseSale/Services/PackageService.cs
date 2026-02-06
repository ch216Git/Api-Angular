using ChineseSale.Dtos;
using ChineseSale.Models;
using ChineseSale.Repositories;

namespace ChineseSale.Services
{
    public class PackageService : IPackageService
    {
        private readonly IPackageRepository _packageRepository;
        public PackageService(IPackageRepository packageRepository)
        {
            _packageRepository = packageRepository;
        }
        public async Task<IEnumerable<GetPackageDto>> GetAllPackageAsync()
        {
            IEnumerable<Package> packages = await _packageRepository.GetAllPackageAsync();
            List<GetPackageDto> packageDtos = new List<GetPackageDto>();
            foreach (var package in packages)
            {
                GetPackageDto packageDto = new GetPackageDto()
                {
                    Id = package.Id,
                    Name = package.Name,
                    Price = package.Price,
                    Description = package.Description,
                    CountCard = package.CountCard,
                    //CountNormalCard = package.CountNormalCard
                };
                packageDtos.Add(packageDto);
            }
            return packageDtos;
        }

        public async Task<GetPackageDto?> GetPackageByIdAsync(int Id)
        {
            Package package = await _packageRepository.GetPackageByIdAsync(Id);
            if (package != null)
            {
               
              
                GetPackageDto packageDto = new GetPackageDto()
                {
                    Id = package.Id,
                    Name = package.Name,
                    Price = package.Price,
                    Description = package.Description,
                    CountCard = package.CountCard,
                };
                return packageDto;
            }
            else
                throw new ArgumentException("package not found");
        }
        public async Task<GetPackageDto> CreatePackageAsync(CreatePackageDto packageDto)
        {
            if(packageDto.Price<0)
            {
                throw new ArgumentException("price must be greater than 0");
            }
            Package package = new Package()
            {
                Name = packageDto.Name,
                Price = packageDto.Price,
                Description = packageDto.Description,
                CountCard = packageDto.CountCard,
                //CountNormalCard = packageDto.CountNormalCard
            };

            await _packageRepository.CreatePackageAsync(package);
            Package package1= await _packageRepository.GetPackageByIdAsync(package.Id);

            return new GetPackageDto
            {
                Id = package1.Id,
                Name = package1.Name,
                Price = package1.Price,
                Description = package1.Description,
                CountCard = package1.CountCard,
                //CountNormalCard = package1.CountNormalCard
            };
        }
        public async Task<GetPackageDto> UpdatePackageAsync(UpdatePackageDto packageDto)
        {
            if(packageDto.Price < 0)
            {
                throw new ArgumentException("price must be greater than 0");
            }
            Package package = await _packageRepository.GetPackageByIdAsync(packageDto.Id);
            if (package == null)
            {
                throw new ArgumentException("not found package");
            }
            package.Name = packageDto.Name;
            package.Price = packageDto.Price;
            package.Description = packageDto.Description;
            package.CountCard = packageDto.CountCard;
            //package.CountNormalCard = packageDto.CountNormalCard;


            Package package1 = await _packageRepository.UpdatePackageAsync(package);
            return await GetPackageByIdAsync(package1.Id);
        }
        public async Task<bool> DeletePackageAsync(int Id)
        {
            Package package = await _packageRepository.GetPackageByIdAsync(Id);
            if (package == null)
                return false;
            await _packageRepository.DeletePackageAsync(package);
            return true;
        }
    }
}
