using ChineseSale.Models;
using System.ComponentModel.DataAnnotations;

namespace ChineseSale.Dtos
{
    public class GetUserDto
    {
        public int Id { get; set; }

        public string UserName { get; set; }

        public string Name { get; set; }

        public string Phone { get; set; }

        public string Address { get; set; }

        public string Email { get; set; }
        public Role Role { get; set; }
    }
    public class CreateUserDto
    {
        [Required, MinLength(4)]
        public string UserName { get; set; }
        [Required, MinLength(4)]
        public string Password { get; set; }
        [Required]
        public string Name { get; set; }
        [Required, Phone]
        public string Phone { get; set; }
        public string Address { get; set; }
        [EmailAddress]
        public string Email { get; set; }
    }
    public class UpdateUserDto
    {
        [Required]
        public int Id { get; set; }
        [MinLength(4)]
        public string UserName { get; set; }
        public string Name { get; set; }
        [Phone]
        public string Phone { get; set; }
        public string Address { get; set; }
        [EmailAddress]
        public string Email { get; set; }
    }
    public class LoginDto
    {
        [Required, MinLength(4)]
        public string UserName { get; set; }
        [Required, MinLength(4)]
        public string Password { get; set; }
    }
}
