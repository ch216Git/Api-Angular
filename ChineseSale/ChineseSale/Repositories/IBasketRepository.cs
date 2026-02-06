using ChineseSale.Models;

namespace ChineseSale.Repositories
{
    public interface IBasketRepository
    {
        Task<IEnumerable<Basket>> GetAllBasketAsync();
        Task<Basket?> GetBasketByIdAsync(int Id);
        Task<Basket?> GetBasketByUserIdAsync(int UserId);
        Task<Basket> CreateBasketAsync(Basket basket);
        Task DeleteBasketAsync(Basket basket);
        Task<Basket> AddGiftToBasket(Basket basket, Gift gift);
        Task<Basket> DeleteGiftFromBasket(Basket basket, Gift gift);
        Task<Basket?> AddPackageToBasket(Basket basket, Package package);
        Task<Basket?> DeletePackageFromBasket(Basket basket, Package package);
    }
}
