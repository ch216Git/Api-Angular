using System.ComponentModel.DataAnnotations;

namespace ChineseSale.Models
{
    public class Donor
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string Phone { get; set; }

        public List<Gift> Gifts { get; set; } = new List<Gift>();
    }
}
