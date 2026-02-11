using ChineseSale.Dtos;
using ChineseSale.Models;
using ChineseSale.Repositories;

namespace ChineseSale.Services
{
    public class DonorService : IDonorService
    {
        private readonly IDonorRepository _donorRepository;
        private readonly IGiftService _giftService;
        public DonorService(IDonorRepository donorRepository, IGiftService giftService)
        {
            _donorRepository = donorRepository;
            _giftService = giftService;
        }

        public async Task<IEnumerable<GetDonorDto>> GetAllDonorAsync()
        {
            IEnumerable<Donor> donors = await _donorRepository.GetAllDonorAsync();
            List<GetDonorDto> donorDtos = new List<GetDonorDto>();
            foreach (var donor in donors)
            {
                GetDonorDto donorDto = new GetDonorDto()
                {
                    Id = donor.Id,
                    Name = donor.Name,
                    Email = donor.Email,
                    Phone = donor.Phone

                };
                donorDtos.Add(donorDto);
            }
            return donorDtos;
        }

        public async Task<GetDonorByIdDto?> GetDonorByIdAsync(int Id)
        {
            Donor donor = await _donorRepository.GetDonorByIdAsync(Id);
            if (donor != null)
            {
                List<GetGiftDto> giftDtos = new List<GetGiftDto>();
                foreach (var gift in donor.Gifts)
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
                GetDonorByIdDto donorByIdDto = new GetDonorByIdDto()
                {
                    Id = donor.Id,
                    Name = donor.Name,
                    Email = donor.Email,
                    Phone = donor.Phone,
                    Gifts = giftDtos
                };
                return donorByIdDto;
            }
            else
                throw new ArgumentException("donor not found");
        }
        public async Task<GetDonorDto> CreateDonorAsync(CreateDonorDto donorDto)
        {
            Donor donor = new Donor
            {
                Name = donorDto.Name,
                Email = donorDto.Email,
                Phone = donorDto.Phone
            };

            await _donorRepository.CreateDonorAsync(donor);

            return new GetDonorDto
            {
                Id = donor.Id,
                Name = donor.Name,
                Email= donor.Email,
                Phone= donor.Phone
            };
        }

        public async Task<GetDonorByIdDto> UpdateDonorAsync(UpdateDonorDto donorDto)
        {
            Donor donor = await _donorRepository.GetDonorByIdAsync(donorDto.Id);
            if (donor == null)
            {
                throw new ArgumentException("not found donor");
            }
            donor.Name = donorDto.Name;
            donor.Email = donorDto.Email;
            donor.Phone = donorDto.Phone;


            Donor donor1 = await _donorRepository.UpdateDonorAsync(donor);
            return await GetDonorByIdAsync(donor1.Id);
        }
        public async Task<bool> DeleteDonorAsync(int Id)
        {
            Donor donor = await _donorRepository.GetDonorByIdAsync(Id);
            if (donor == null)
                return false;
            for (int i=0;i<donor.Gifts.Count();i++)
            {
                await _giftService.DeleteGiftAsync(donor.Gifts[i].Id);
            }
            if(donor.Gifts.Count()>0)
                return false;
            await _donorRepository.DeleteDonorAsync(donor);
            return true;
        }
        public async Task<IEnumerable<GetDonorDto>> GetSearchByNameDonorAsync(string str)
        {
            IEnumerable<Donor> donors = await _donorRepository.GetSearchByNameDonorAsync(str);
            List<GetDonorDto> donorDtos = new List<GetDonorDto>();
            foreach (var donor in donors)
            {
                GetDonorDto donorDto = new GetDonorDto()
                {
                    Id = donor.Id,
                    Name = donor.Name,
                    Email = donor.Email,
                    Phone = donor.Phone

                };
                donorDtos.Add(donorDto);
            }
            return donorDtos;
        }
        public async Task<IEnumerable<GetDonorDto>> GetSearchByEmailDonorAsync(string str)
        {
            IEnumerable<Donor> donors = await _donorRepository.GetSearchByEmailDonorAsync(str);
            List<GetDonorDto> donorDtos = new List<GetDonorDto>();
            foreach (var donor in donors)
            {
                GetDonorDto donorDto = new GetDonorDto()
                {
                    Id = donor.Id,
                    Name = donor.Name,
                    Email = donor.Email,
                    Phone = donor.Phone

                };
                donorDtos.Add(donorDto);
            }
            return donorDtos;
        }
        public async Task<IEnumerable<GetDonorDto>> GetSearchByGiftDonorAsync(string str)
        {
            IEnumerable<Donor> donors = await _donorRepository.GetSearchByGiftDonorAsync(str);
            List<GetDonorDto> donorDtos = new List<GetDonorDto>();
            foreach (var donor in donors)
            {
                GetDonorDto donorDto = new GetDonorDto()
                {
                    Id = donor.Id,
                    Name = donor.Name,
                    Email = donor.Email,
                    Phone = donor.Phone
                };
                donorDtos.Add(donorDto);
            }
            return donorDtos;


        }
    }
}
