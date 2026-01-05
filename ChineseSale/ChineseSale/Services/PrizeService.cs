using ChineseSale.Dtos;
using ChineseSale.Models;
using ChineseSale.Repositories;

namespace ChineseSale.Services
{
    public class PrizeService : IPrizeService
    {
        private readonly IPrizeRepository _prizeRepository;
        private readonly IOrderService _orderService;
        private readonly IGiftRepository _giftRepository;
        public PrizeService(IPrizeRepository prizeRepository,IOrderService orderService, IGiftRepository giftRepository)
        {
            _prizeRepository = prizeRepository;
            _orderService = orderService;
            _giftRepository = giftRepository;
        }
        public async Task<IEnumerable<GetPrizeDto>> GetAllPrizeAsync()
        {
            IEnumerable<Prize> prizes = await _prizeRepository.GetAllPrizeAsync();
            List<GetPrizeDto> prizeDtos = new List<GetPrizeDto>();
            foreach (var prize in prizes)
            {
                GetPrizeDto prizeDto = new GetPrizeDto()
                {
                    Id = prize.Id,
                    UserId= prize.UserId,
                    GiftId= prize.GiftId,
                };
                prizeDtos.Add(prizeDto);
            }
            return prizeDtos;
        }
        public async Task<GetPrizeDto?> GetPrizeByIdAsync(int Id)
        {
            Prize prize = await _prizeRepository.GetPrizeByIdAsync(Id);
            if (prize != null)
            {


                GetPrizeDto prizeDto = new GetPrizeDto()
                {
                    Id = prize.Id,
                    UserId = prize.UserId,
                    GiftId = prize.GiftId,
                };
                return prizeDto;
            }
            else
                throw new ArgumentException("prize not found");
        }

        public async Task<GetPrizeDto?> GetPrizeByUserIdAsync(int UserId)
        {
            Prize prize = await _prizeRepository.GetPrizeByUserIdAsync(UserId);
            if (prize != null)
            {


                GetPrizeDto prizeDto = new GetPrizeDto()
                {
                    Id = prize.Id,
                    UserId = prize.UserId,
                    GiftId = prize.GiftId,
                };
                return prizeDto;
            }
            else
                throw new ArgumentException("prize not found");
        }

        public async Task<GetPrizeDto> CreatePrizeAsync(CreatePrizeDto prizeDto)
        {
            Prize prize = new Prize()
            {
                UserId = prizeDto.UserId,
                GiftId= prizeDto.GiftId
            };

            await _prizeRepository.CreatePrizeAsync(prize);
            Prize prize1 = await _prizeRepository.GetPrizeByIdAsync(prize.Id);

            return new GetPrizeDto
            {
                Id = prize1.Id,
                UserId = prize1.UserId,
                GiftId = prize1.GiftId
            };
        }

        public async Task<GetPrizeDto> SelectRandomPrize(int giftId)
        {
            Gift gift=await _giftRepository.GetByIdGiftAsync(giftId);
            if (gift == null)
            {
                throw new ArgumentException("gift not found");
            }
            IEnumerable<GetUserDto> result= await _orderService.GetBuyerGift(giftId);
            if(result.Count()==0)
            {
                throw new ArgumentException("no buyers for this gift");
            }
            List<GetUserDto> usersDto=result.ToList();
            Random rnd = new Random();
            int prizePos = rnd.Next(0, usersDto.Count());
            CreatePrizeDto prizeDto = new CreatePrizeDto()
            {
                UserId = usersDto[prizePos].Id,
                GiftId = giftId
            };
            return await CreatePrizeAsync(prizeDto);
        }
    }
}
