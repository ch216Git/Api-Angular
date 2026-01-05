using ChineseSale.Dtos;
using ChineseSale.Models;
using ChineseSale.Repositories;

namespace ChineseSale.Services
{
    public class BasketService: IBasketService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IGiftService _giftService;
        private readonly IGiftRepository _giftRepository;
        public BasketService(IBasketRepository basketRepository,IGiftService giftService, IGiftRepository giftRepository)
        {
            _basketRepository = basketRepository;
            _giftService = giftService;
            _giftRepository = giftRepository;
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
                for (int i = 0; i < basket.GiftsId.Count(); i++)
                {
                    GetGiftDto giftDto = await _giftService.GetByIdGiftAsync(basket.GiftsId[i]);
                    giftsDto.Add(giftDto);
                }
                GetBasketByUserIdDto basketByIdDto = new GetBasketByUserIdDto()
                {
                    Id = basket.Id,
                    UserId = basket.UserId,
                    gifts = giftsDto,
                    Sum= basket.Sum
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
                for (int i = 0; i < basket.GiftsId.Count(); i++)
                {
                    GetGiftDto giftDto = await _giftService.GetByIdGiftAsync(basket.GiftsId[i]);
                    giftsDto.Add(giftDto);
                }
                GetBasketByUserIdDto basketByIdDto = new GetBasketByUserIdDto()
                {
                    Id = basket.Id,
                    UserId = basket.UserId,
                    gifts = giftsDto,
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
                UserId= basket.UserId,
                Sum= basket.Sum
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
            Basket basket=await _basketRepository.GetBasketByIdAsync(giftToBasketDto.BasketId);
            if (basket == null)
                throw new ArgumentException("basket not found");
            Gift gift= await _giftRepository.GetByIdGiftAsync(giftToBasketDto.giftId);
            await _basketRepository.AddGiftToBasket(basket,gift);
            return await GetBasketByIdAsync(basket.Id);
        }
        public async Task<GetBasketByUserIdDto> DeleteGiftFromBasket(DeleteGiftFromBasketDto giftToBasketDto)
        {
            Basket basket = await _basketRepository.GetBasketByIdAsync(giftToBasketDto.BasketId);
            if (basket == null)
                throw new ArgumentException("basket not found");
            Gift gift = await _giftRepository.GetByIdGiftAsync(giftToBasketDto.giftId);
            basket.GiftsId.Remove(giftToBasketDto.giftId);
            await _basketRepository.DeleteGiftFromBasket(basket, gift);
            return await GetBasketByIdAsync(basket.Id);
        }
    }
}
