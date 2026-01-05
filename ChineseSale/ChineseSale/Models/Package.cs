using System.ComponentModel.DataAnnotations;

namespace ChineseSale.Models
{
    public class Package
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int Price { get; set; }
        public string Description { get; set; }
        public int CountSpecialCard { get; set; } = 0;
        public int CountNormalCard { get; set; } = 0;
    }
}
