using ChineseSale.Dtos;
using ChineseSale.Models;
using ChineseSale.Repositories;

namespace ChineseSale.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }
        public async Task<IEnumerable<GetCategoryDto>> GetAllCategoryAsync()
        {
            IEnumerable<Category> categorys = await _categoryRepository.GetAllCategoryAsync();
            List<GetCategoryDto> categoryDtos = new List<GetCategoryDto>();
            foreach (var category in categorys)
            {
                GetCategoryDto categoryDto = new GetCategoryDto()
                {
                    Id = category.Id,
                    Name = category.Name,
                    
                };
                categoryDtos.Add(categoryDto);
            }
            return categoryDtos;
        }
        public async Task<GetCategoryByIdDto?> GetCategoryByIdAsync(int Id)
        {
            Category category = await _categoryRepository.GetCategoryByIdAsync(Id);
            if (category != null)
            {
                List<GetGiftDto> giftDtos = new List<GetGiftDto>();
                foreach (var gift in category.Gifts)
                {
                    GetGiftDto giftDto = new GetGiftDto()
                    {
                        Id = gift.Id,
                        Name = gift.Name,
                        PriceCard = gift.PriceCard,
                        Description = gift.Description,
                        Image = gift.Image,
                        Value = gift.Value,
                        Category = new GetCategoryDto() { Id = gift.Category.Id, Name = gift.Category.Name },
                        Donor = new GetDonorDto() { Id = gift.Donor.Id, Name = gift.Donor.Name, Email = gift.Donor.Email, Phone = gift.Donor.Phone },
                        SumCustomers = gift.SumCustomers
                    };
                    giftDtos.Add(giftDto);
                }
                GetCategoryByIdDto categoryByIdDto = new GetCategoryByIdDto()
                {
                    Id = category.Id,
                    Name = category.Name,
                   Gifts=giftDtos
                };
                return categoryByIdDto;
            }
            else
                throw new ArgumentException("category not found");
        }
        public async Task<GetCategoryDto> CreateCategoryAsync(CreateCategorDto categoryDto)
        {
            var category = new Category
            {
                Name = categoryDto.Name
            };

            await _categoryRepository.CreateCategoryAsync(category);

            return new GetCategoryDto
            {
                Id = category.Id,
                Name = category.Name
            };
        }

        public async Task<GetCategoryByIdDto> UpdateCategoryAsync(UpdateCategoryDto categoryDto)
        {
            Category category = await _categoryRepository.GetCategoryByIdAsync(categoryDto.Id);
            if (category == null)
            {
                throw new ArgumentException("not found category");
            }
            category.Name = categoryDto.Name;


            Category category1 = await _categoryRepository.UpdateCategoryAsync(category);
            return await GetCategoryByIdAsync(category1.Id);
        }
        public async Task<bool> DeleteCategoryAsync(int Id)
        {
            Category category = await _categoryRepository.GetCategoryByIdAsync(Id);
            if (category == null||category.Gifts.Count()>0)
                return false;
            await _categoryRepository.DeleteCategoryAsync(category);
            return true;
        }
    }
}
