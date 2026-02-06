using System.ComponentModel.DataAnnotations;

namespace ChineseSale.Dtos
{
    public class GetPackageDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public string Description { get; set; }
        public int CountCard { get; set; }
        //public int CountNormalCard { get; set; }
    }
    public class CreatePackageDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public int Price { get; set; }
        public string Description { get; set; }
        [Required]
        public int CountCard { get; set; }
        //public int CountNormalCard { get; set; }
    }
    public class UpdatePackageDto
    {
        [Required]
        public int Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public string Description { get; set; }
        public int CountCard { get; set; }
        //public int CountNormalCard { get; set; }
    }
}
