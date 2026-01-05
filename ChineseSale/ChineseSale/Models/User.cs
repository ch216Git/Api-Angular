using System.ComponentModel.DataAnnotations;

namespace ChineseSale.Models
{
     public enum Role{
        Manager,
        Customer
    }
    public class User
    {
        public int Id { get; set; }

        [Required,MinLength(4)]
        public string UserName { get; set; }

        [Required,MinLength(4)]
        public string Password { get; set; }

        [Required]
        public string Name { get; set; }

        [Required,Phone]
        public string Phone { get; set; }

        public string Address { get; set; }

        [EmailAddress]
        public string Email { get; set; }
        public Role Role { get; set; }
    }
}
