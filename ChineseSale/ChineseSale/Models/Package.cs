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

        [Required]
        public int CountCard { get; set; }
        //public int CountNormalCard { get; set; } = 0;
    }
}
