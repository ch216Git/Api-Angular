using ChineseSale.Dtos;

namespace ChineseSale.Services
{
    public interface IBasketService
    {
        Task<IEnumerable<GetBasketDto>> GetAllBasketAsync();
        Task<GetBasketByUserIdDto?> GetBasketByIdAsync(int Id);
        Task<GetBasketByUserIdDto?> GetBasketByUserIdAsync(int Id);
        Task<GetBasketDto> CreateBasketAsync(CreateBasketDto basketDto);
        Task<GetBasketByUserIdDto> AddGiftToBasket(AddGiftToBasketDto basketDto);
        Task<GetBasketByUserIdDto> DeleteGiftFromBasket(DeleteGiftFromBasketDto basketDto);
        Task<bool> DeleteBasketAsync(int Id);
        Task<GetBasketByUserIdDto> AddPackageToBasket(AddPackageToBasketDto packageToBasketDto);
        Task<GetBasketByUserIdDto> DeletePackageFromBasket(DeletePackageFromBasketDto packageFromBasketDto);
    }
}
