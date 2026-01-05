using ChineseSale.Models;

namespace ChineseSale.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(int Id);
        Task<User?> GetUserByUserNameAsync(string UserName);
        Task<User> CreateUserAsync(User user);
        Task<User?> UpdateUserAsync(User user);
        Task DeleteUserAsync(User user);
    }
}
