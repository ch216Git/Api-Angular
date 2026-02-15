using ChineseSale.Dtos;
using ChineseSale.Models;
using ChineseSale.Repositories;

namespace ChineseSale.Services
{
    public class GiftService : IGiftService
    {
        private readonly IGiftRepository _giftRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IDonorRepository _donorRepository;
        private readonly IBasketRepository _basketRepository;
        private readonly IOrderRepository _orderRepository;
        public GiftService(IGiftRepository giftRepository,ICategoryRepository categoryRepository,OrderRepository orderRepository,BasketRepository basketRepository,IDonorRepository donorRepository)
        {
            _giftRepository = giftRepository;
            _categoryRepository = categoryRepository;
            _donorRepository = donorRepository;
            _basketRepository = basketRepository;
            _orderRepository = orderRepository;
        }
        public async Task<IEnumerable<GetGiftDto>> GetAllGiftAsync()
        {
            IEnumerable<Gift> gifts = await _giftRepository.GetAllGiftAsync();
            List<GetGiftDto> giftDtos = new List<GetGiftDto>();
            foreach (var gift in gifts)
            {
                GetGiftDto giftDto = new GetGiftDto()
                {
                    Id = gift.Id,
                    Name = gift.Name,
                    Description = gift.Description,
                    Image = gift.Image,
                    Value = gift.Value,
                    Category = new GetCategoryDto() { Id = gift.Category.Id, Name = gift.Category.Name },
                    Donor = new GetDonorDto() { Id = gift.Donor.Id, Name = gift.Donor.Name, Email = gift.Donor.Email, Phone = gift.Donor.Phone },
                    //TypeCard = gift.TypeCard,
                    SumCustomers = gift.SumCustomers
                };
                giftDtos.Add(giftDto);
            }
            return giftDtos;

        }
        public async Task<GetGiftDto?> GetByIdGiftAsync(int Id)
        {
            Gift gift= await _giftRepository.GetByIdGiftAsync(Id);
            if (gift != null)
            {
                GetGiftDto giftDto = new GetGiftDto()
                {
                    Id = gift.Id,
                    Name = gift.Name,
                    Description = gift.Description,
                    Image = gift.Image,
                    Value = gift.Value,
                    Category = new GetCategoryDto() { Id = gift.Category.Id, Name = gift.Category.Name },
                    Donor = new GetDonorDto() { Id=gift.Donor.Id,Name=gift.Donor.Name,Email=gift.Donor.Email,Phone=gift.Donor.Phone},
                    //TypeCard = gift.TypeCard,
                    SumCustomers = gift.SumCustomers
                };
                return giftDto;
            }
            else
                throw new ArgumentException("not found");
        }
        public async Task<GetGiftDto> CreateGiftAsync(CreateGiftDto giftDto)
        {
            if (giftDto.Value <= 0) 
            {
                throw new ArgumentException("Value must be greater than 0");
            }
            Gift gift= new Gift()
            { 
                Name = giftDto.Name,
                Description = giftDto.Description,
                Image = giftDto.Image,
                Value = giftDto.Value,
                CategoryId = giftDto.CategoryId,
                DonorId = giftDto.DonorId,
                //TypeCard = giftDto.TypeCard
            };
            Gift gift1= await _giftRepository.CreateGiftAsync(gift);
            Gift gift2 = await _giftRepository.GetByIdGiftAsync(gift1.Id);
            await _categoryRepository.AddGiftToCategory(gift2, gift2.Category);
            await _donorRepository.AddGiftToDonor(gift2, gift2.Donor);
            GetGiftDto giftDto1= new GetGiftDto() 
            {
                Id = gift2.Id,
                Name = gift2.Name,
                Description = gift2.Description,
                Image = gift2.Image,
                Value = gift2.Value,
                Category= new GetCategoryDto() { Id = gift2.Category.Id, Name = gift2.Category.Name },
                Donor = new GetDonorDto() { Id = gift2.Donor.Id, Name = gift2.Donor.Name, Email = gift2.Donor.Email, Phone = gift2.Donor.Phone },
                //TypeCard = gift2.TypeCard,
                SumCustomers = gift2.SumCustomers               
            };
            return giftDto1;
        }

        public async Task<bool> DeleteGiftAsync(int Id)
        {
            Gift gift = await _giftRepository.GetByIdGiftAsync(Id);
            if (gift == null)
                return false;
            var allBaskets = await _basketRepository.GetAllBasketAsync();
            bool existsInBaskets = allBaskets.Any(b => b.GiftsId != null && b.GiftsId.Contains(Id));
            if (existsInBaskets)
            {
                throw new InvalidOperationException("לא ניתן למחוק את המתנה כי היא נמצאת בסל קניות של אחד המשתמשים.");
            }
            var allOrders = await _orderRepository.GetAllOrdersAsync();
            bool existsInOrders = allOrders.Any(o => o.GiftsId != null && o.GiftsId.Contains(Id));

            if (existsInOrders)
            {
                throw new InvalidOperationException("לא ניתן למחוק את המתנה כי קיימות הזמנות מאושרות עבורה.");
            }
            await _giftRepository.DeleteGiftAsync(gift);
            await _categoryRepository.DeleteGiftFromCategory(gift, gift.Category);
            await _donorRepository.DeleteGiftFromDonor(gift, gift.Donor);

            return true;
        }

        public async Task<IEnumerable<GetGiftDto?>> ExistsGiftAsync(string Name)
        {

            IEnumerable<Gift> gifts = await _giftRepository.ExistsGiftAsync(Name);
            List<GetGiftDto> giftDtos = new List<GetGiftDto>();
            foreach (var gift in gifts)
            {
                GetGiftDto giftDto = new GetGiftDto()
                {
                    Id = gift.Id,
                    Name = gift.Name,
                    Description = gift.Description,
                    Image = gift.Image,
                    Value = gift.Value,
                    Category = new GetCategoryDto() { Id=gift.Category.Id,Name=gift.Category.Name},
                    Donor = new GetDonorDto() { Id = gift.Donor.Id, Name = gift.Donor.Name, Email = gift.Donor.Email, Phone = gift.Donor.Phone },
                    //TypeCard = gift.TypeCard,
                    SumCustomers = gift.SumCustomers
                };
                giftDtos.Add(giftDto);
            }
            return giftDtos;

        }



        public async Task<GetGiftDto> UpdateGiftAsync(UpdateGiftDto giftDto)
        {
            Gift gift = await _giftRepository.GetByIdGiftAsync(giftDto.Id);
            if (gift == null)
                throw new ArgumentException("not found gift");

            Category oldCategory = gift.Category;
            Donor oldDonor = gift.Donor;

            if (gift == null)
            {
                throw new ArgumentException("not found gift");
            }
            if (giftDto.Value <= 0)
            {
                throw new ArgumentException("Value must be greater than 0");
            }
            gift.Name = giftDto.Name;          
            gift.Description = giftDto.Description;
            gift.Value = giftDto.Value;
            gift.DonorId = giftDto.DonorId;
            gift.CategoryId = giftDto.CategoryId;
            //gift.TypeCard = giftDto.TypeCard;
            gift.Image= giftDto.Image;

            await _giftRepository.UpdateGiftAsync(gift);

            Gift gift1 = await _giftRepository.GetByIdGiftAsync(gift.Id);


            GetGiftDto giftDto1 = new GetGiftDto()
            {
                Id = gift.Id,
                Name = gift1.Name,
                Description = gift1.Description,
                Image = gift1.Image,
                Value = gift1.Value,
                Category = new GetCategoryDto() { Id = gift1.Category.Id, Name = gift1.Category.Name },
                Donor = new GetDonorDto() { Id = gift1.Donor.Id, Name = gift1.Donor.Name, Email = gift1.Donor.Email, Phone = gift1.Donor.Phone },
                //TypeCard = gift1.TypeCard,
                SumCustomers = gift1.SumCustomers

            };
            if(oldCategory.Id != gift1.CategoryId)
            {
                await _categoryRepository.DeleteGiftFromCategory(gift, oldCategory);
                await _categoryRepository.AddGiftToCategory(gift1, gift1.Category);
            }
            if(oldDonor.Id != gift1.DonorId)
            {
                await _donorRepository.DeleteGiftFromDonor(gift, oldDonor);
                await _donorRepository.AddGiftToDonor(gift1, gift1.Donor);
            }
            return giftDto1;
        }
        public async Task<IEnumerable<GetGiftDto>> SortGiftByPriceAsync()
        {
            IEnumerable<Gift> gifts = await _giftRepository.SortGiftByPriceAsync();
            List<GetGiftDto> giftDtos = new List<GetGiftDto>();
            foreach (var gift in gifts)
            {
                GetGiftDto giftDto = new GetGiftDto()
                {
                    Id = gift.Id,
                    Name = gift.Name,
                    Description = gift.Description,
                    Image = gift.Image,
                    Value = gift.Value,
                    Category = new GetCategoryDto() { Id = gift.Category.Id, Name = gift.Category.Name },
                    Donor = new GetDonorDto() { Id = gift.Donor.Id, Name = gift.Donor.Name, Email = gift.Donor.Email, Phone = gift.Donor.Phone },
                    //TypeCard = gift.TypeCard,
                    SumCustomers = gift.SumCustomers
                };
                giftDtos.Add(giftDto);
            }
            return giftDtos;
        }
        public async Task<IEnumerable<GetGiftDto>> SortGiftByBuyerAsync()
        {
            IEnumerable<Gift> gifts = await _giftRepository.SortGiftByBuyerAsync();
            List<GetGiftDto> giftDtos = new List<GetGiftDto>();
            foreach (var gift in gifts)
            {
                GetGiftDto giftDto = new GetGiftDto()
                {
                    Id = gift.Id,
                    Name = gift.Name,
                    Description = gift.Description,
                    Image = gift.Image,
                    Value = gift.Value,
                    Category = new GetCategoryDto() { Id = gift.Category.Id, Name = gift.Category.Name },
                    Donor = new GetDonorDto() { Id = gift.Donor.Id, Name = gift.Donor.Name, Email = gift.Donor.Email, Phone = gift.Donor.Phone },
                    SumCustomers = gift.SumCustomers
                };
                giftDtos.Add(giftDto);
            }
            return giftDtos;
        }
        public async Task<IEnumerable<GetGiftDto?>> ExistsSumAsync(int sumCostumer)
        {

            IEnumerable<Gift> gifts = await _giftRepository.ExistsSumAsync(sumCostumer);

            List<GetGiftDto> giftDtos = new List<GetGiftDto>();

            foreach (var gift in gifts)
            {
                GetGiftDto getGiftDto = new GetGiftDto()
                {
                    Id = gift.Id,
                    Name = gift.Name,
                    Description = gift.Description,
                    Image = gift.Image,
                    Value = gift.Value,
                    Category = new GetCategoryDto() { Id = gift.Category.Id, Name = gift.Category.Name },
                    Donor = new GetDonorDto() { Id = gift.Donor.Id, Name = gift.Donor.Name, Email = gift.Donor.Email, Phone = gift.Donor.Phone },
                    SumCustomers = gift.SumCustomers
                };

                giftDtos.Add(getGiftDto);
            }

            return giftDtos;
        }




        public async Task<IEnumerable<GetGiftDto?>> ExistsDonorAsync(string donor)
        {

            IEnumerable<Gift> gifts = await _giftRepository.ExistsDonorAsync(donor);

            List<GetGiftDto> giftDtos = new List<GetGiftDto>();

            foreach (var gift in gifts)
            {
                GetGiftDto getGiftDto = new GetGiftDto()
                {
                    Id = gift.Id,
                    Name = gift.Name,
                    Description = gift.Description,
                    Image = gift.Image,
                    Value = gift.Value,
                    Category = new GetCategoryDto() { Id = gift.Category.Id, Name = gift.Category.Name },
                    Donor = new GetDonorDto() { Id = gift.Donor.Id, Name = gift.Donor.Name, Email = gift.Donor.Email, Phone = gift.Donor.Phone },
                    SumCustomers = gift.SumCustomers
                };

                giftDtos.Add(getGiftDto);
            }

            return giftDtos;
        }


    }
}
