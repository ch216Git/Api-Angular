using ChineseSale.Dtos;
using ChineseSale.Models;
using ChineseSale.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChineseSale.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _config;

        public UserController(IUserService userService, IConfiguration config)
        {
            _userService = userService;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<ActionResult<GetUserDto>> Register(CreateUserDto dto)
        {
            var user = await _userService.CreateUserAsync(dto);
            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDto dto)
        {
            var user = await _userService.LoginAsync(dto);
            var token = GenerateJwtToken(user);
            return Ok(new { Token = token });
        }

        //[Authorize(Roles= "Manager")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetUserDto>>> GetAllUsersAsync()
        {
            return Ok(await _userService.GetAllUsersAsync());
        }

        //[Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<GetUserDto>> GetUserByIdAsync(int id)
        {
            //var userId = int.Parse(User.Claims.First(c => c.Type == "id").Value);
            //var role = User.Claims.First(c => c.Type == ClaimTypes.Role).Value;

            //if (role != "Manager" && userId != id)
            //    return Forbid("You can only access your own profile.");

            return Ok(await _userService.GetUserByIdAsync(id));
        }

        [Authorize]
        [HttpPost("Update")]
        public async Task<ActionResult<GetUserDto>> UpdateUserAsync(UpdateUserDto dto)
        {
            return Ok(await _userService.UpdateUserAsync(dto));
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserAsync(int Id)
        {
            try
            {
                bool result = await _userService.DeleteUserAsync(Id);
                if (result)
                    return Ok("user deleted successfully");
                else
                    return BadRequest("Failed to delete user");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private string GenerateJwtToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role.ToString()),
                    new Claim("username", user.UserName),
                    new Claim(ClaimTypes.Name, user.Name.ToString()),
                    new Claim(ClaimTypes.StreetAddress, user.Address.ToString()),
                    new Claim(ClaimTypes.HomePhone, user.Phone.ToString()),
                    new Claim(ClaimTypes.Email, user.Email.ToString()),

                }),

                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User ID claim missing");

            return int.Parse(userIdClaim.Value);
        }

    }
}