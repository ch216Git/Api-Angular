using ChineseSale.Dtos;
using ChineseSale.Models;

namespace ChineseSale.Services
{
    public interface IUserService
    {
        Task<IEnumerable<GetUserDto>> GetAllUsersAsync();
        Task<GetUserDto?> GetUserByIdAsync(int Id);
        Task<GetUserDto?> GetUserByUserNameAsync(string UserName);
        Task<GetUserDto> CreateUserAsync(CreateUserDto userDto);
        Task<GetUserDto?> UpdateUserAsync(UpdateUserDto userDto);
        Task<bool> DeleteUserAsync(int Id);
        Task<User> LoginAsync(LoginDto loginDto);
    }
}
