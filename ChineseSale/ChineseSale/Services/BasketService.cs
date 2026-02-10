
using ChineseSale.Dtos;
using ChineseSale.Models;
using ChineseSale.Repositories;

namespace ChineseSale.Services
{
    public class BasketService : IBasketService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IGiftService _giftService;
        private readonly IGiftRepository _giftRepository;
        private readonly IPackageRepository _packageRepository;
        private readonly IPackageService _packageService;

        public BasketService(
            IBasketRepository basketRepository,
            IGiftService giftService,
            IGiftRepository giftRepository,
            IPackageRepository packageRepository,
            IPackageService packageService)
        {
            _basketRepository = basketRepository;
            _giftService = giftService;
            _giftRepository = giftRepository;
            _packageRepository = packageRepository;
            _packageService = packageService;
        }

        public async Task<IEnumerable<GetBasketDto>> GetAllBasketAsync()
        {
            IEnumerable<Basket> baskets = await _basketRepository.GetAllBasketAsync();
            List<GetBasketDto> basketDtos = new List<GetBasketDto>();
            foreach (var basket in baskets)
            {
                GetBasketDto basketDto = new GetBasketDto()
                {
                    Id = basket.Id,
                    UserId = basket.UserId,
                    Sum = basket.Sum
                };
                basketDtos.Add(basketDto);
            }
            return basketDtos;
        }

        public async Task<GetBasketByUserIdDto?> GetBasketByIdAsync(int Id)
        {
            Basket basket = await _basketRepository.GetBasketByIdAsync(Id);

            if (basket != null)
            {
                List<GetGiftDto> giftsDto = new List<GetGiftDto>();
                for (int i = 0; i < (basket.GiftsId?.Count ?? 0); i++)
                {
                    GetGiftDto giftDto = await _giftService.GetByIdGiftAsync(basket.GiftsId[i]);
                    giftsDto.Add(giftDto);
                }

                List<GetPackageDto> packagesDto = new List<GetPackageDto>();
                if (basket.PackagesId != null && basket.PackagesId.Count > 0)
                {
                    foreach (var packageId in basket.PackagesId)
                    {
                        var packageDto = await _packageService.GetPackageByIdAsync(packageId);
                        if (packageDto != null)
                            packagesDto.Add(packageDto);
                    }
                }

                GetBasketByUserIdDto basketByIdDto = new GetBasketByUserIdDto()
                {
                    Id = basket.Id,
                    UserId = basket.UserId,
                    gifts = giftsDto,
                    packages = packagesDto,
                    Sum = basket.Sum
                };
                return basketByIdDto;
            }
            else
                throw new ArgumentException("basket not found");
        }

        public async Task<GetBasketByUserIdDto?> GetBasketByUserIdAsync(int UserId)
        {
            Basket basket = await _basketRepository.GetBasketByUserIdAsync(UserId);

            if (basket != null)
            {
                List<GetGiftDto> giftsDto = new List<GetGiftDto>();
                for (int i = 0; i < (basket.GiftsId?.Count ?? 0); i++)
                {
                    GetGiftDto giftDto = await _giftService.GetByIdGiftAsync(basket.GiftsId[i]);
                    giftsDto.Add(giftDto);
                }

                List<GetPackageDto> packagesDto = new List<GetPackageDto>();
                if (basket.PackagesId != null && basket.PackagesId.Count > 0)
                {
                    foreach (var packageId in basket.PackagesId)
                    {
                        var packageDto = await _packageService.GetPackageByIdAsync(packageId);
                        if (packageDto != null)
                            packagesDto.Add(packageDto);
                    }
                }

                GetBasketByUserIdDto basketByIdDto = new GetBasketByUserIdDto()
                {
                    Id = basket.Id,
                    UserId = basket.UserId,
                    gifts = giftsDto,
                    packages = packagesDto,
                    Sum = basket.Sum
                };
                return basketByIdDto;
            }
            else
                throw new ArgumentException("basket not found");
        }

        public async Task<GetBasketDto> CreateBasketAsync(CreateBasketDto basketDto)
        {
            Basket? existsBasket = await _basketRepository.GetBasketByUserIdAsync(basketDto.UserId);
            if (existsBasket != null)
            {
                throw new ArgumentException("basket for this user already exists");
            }

            Basket basket = new Basket()
            {
                UserId = basketDto.UserId,
            };

            await _basketRepository.CreateBasketAsync(basket);

            return new GetBasketDto
            {
                Id = basket.Id,
                UserId = basket.UserId,
                Sum = basket.Sum
            };
        }

        public async Task<bool> DeleteBasketAsync(int Id)
        {
            Basket basket = await _basketRepository.GetBasketByIdAsync(Id);
            if (basket == null)
                return false;
            await _basketRepository.DeleteBasketAsync(basket);
            return true;
        }

        public async Task<GetBasketByUserIdDto> AddGiftToBasket(AddGiftToBasketDto giftToBasketDto)
        {
            Basket basket = await _basketRepository.GetBasketByIdAsync(giftToBasketDto.BasketId);
            if (basket == null)
                throw new ArgumentException("basket not found");
            Gift gift = await _giftRepository.GetByIdGiftAsync(giftToBasketDto.giftId);
            await _basketRepository.AddGiftToBasket(basket, gift);
            return await GetBasketByIdAsync(basket.Id);
        }

        public async Task<GetBasketByUserIdDto> DeleteGiftFromBasket(DeleteGiftFromBasketDto giftToBasketDto)
        {
            Basket basket = await _basketRepository.GetBasketByIdAsync(giftToBasketDto.BasketId);
            if (basket == null)
                throw new ArgumentException("basket not found");
            Gift gift = await _giftRepository.GetByIdGiftAsync(giftToBasketDto.giftId);
            //basket.GiftsId.Remove(giftToBasketDto.giftId);
            await _basketRepository.DeleteGiftFromBasket(basket, gift);
            return await GetBasketByIdAsync(basket.Id);
        }

        public async Task<GetBasketByUserIdDto> AddPackageToBasket(AddPackageToBasketDto packageToBasketDto)
        {
            Basket basket = await _basketRepository.GetBasketByIdAsync(packageToBasketDto.BasketId);
            if (basket == null)
                throw new ArgumentException("Basket not found");
            Package package = await _packageRepository.GetPackageByIdAsync(packageToBasketDto.packageId);
            if (package == null)
                throw new ArgumentException("Package not found");
            basket.PackagesId ??= new List<int>();

            //basket.PackagesId.Add(package.Id);
            await _basketRepository.AddPackageToBasket(basket, package);
            return await GetBasketByIdAsync(basket.Id);
        }

        public async Task<GetBasketByUserIdDto> DeletePackageFromBasket(DeletePackageFromBasketDto packageFromBasketDto)
        {
            Basket basket = await _basketRepository.GetBasketByIdAsync(packageFromBasketDto.BasketId);
            if (basket == null)
                throw new ArgumentException("basket not found");
            int countGift= basket.GiftsId?.Count ?? 0;
            Package package = await _packageRepository.GetPackageByIdAsync(packageFromBasketDto.packageId);
            int zoverCard = 0;
            Boolean minus = false;
            for (int i = 0; i < basket.PackagesId?.Count; i++) {
                if (!minus&&basket.PackagesId[i]== packageFromBasketDto.packageId) {
                    //zoverCard-=package.CountCard;
                    minus = true;
                 }
                else
                {
                    Package package1 = await _packageRepository.GetPackageByIdAsync(basket.PackagesId[i]);
                    zoverCard += package1.CountCard;
                }                  
            }
            if (basket.GiftsId?.Count > zoverCard)
            {
                int countDelete = basket.GiftsId.Count-zoverCard;
                for (int i = basket.GiftsId.Count-1;i >=zoverCard;i--) {
                    DeleteGiftFromBasketDto deleteGiftFromBasketDto = new DeleteGiftFromBasketDto() { BasketId = basket.Id, giftId = basket.GiftsId[i] };
                    await DeleteGiftFromBasket(deleteGiftFromBasketDto);
                }
              }
            //basket.PackagesId?.Remove(packageFromBasketDto.packageId);
            await _basketRepository.DeletePackageFromBasket(basket, package);
            return await GetBasketByIdAsync(basket.Id);
            }
        public async Task<GetBasketByUserIdDto> DeleteAllPackageFromBasket(DeletePackageFromBasketDto packageFromBasketDto)
        {
            Basket basket = await _basketRepository.GetBasketByIdAsync(packageFromBasketDto.BasketId);
            if (basket == null)
                throw new ArgumentException("basket not found");
            var instancesToDelete = basket.PackagesId.Where(x => x == packageFromBasketDto.packageId).ToList();
            foreach (var item in instancesToDelete)
            {
                await DeletePackageFromBasket(packageFromBasketDto);
            }
            return await GetBasketByIdAsync(basket.Id);
        }
        public async Task<GetBasketByUserIdDto> DeleteAllGiftFromBasket(DeleteGiftFromBasketDto giftToBasketDto)
        {
            Basket basket = await _basketRepository.GetBasketByIdAsync(giftToBasketDto.BasketId);
            if (basket == null)
                throw new ArgumentException("basket not found");
            var instancesToDelete = basket.GiftsId.Where(x => x == giftToBasketDto.giftId).ToList();
            foreach (var item in instancesToDelete)
            {
                await DeleteGiftFromBasket(giftToBasketDto);
            }
            return await GetBasketByIdAsync(basket.Id);
        }
    }
}