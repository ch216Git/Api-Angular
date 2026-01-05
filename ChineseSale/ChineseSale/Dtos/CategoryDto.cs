using ChineseSale.Models;
using System.ComponentModel.DataAnnotations;

namespace ChineseSale.Dtos
{
    public class GetCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class GetCategoryByIdDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<GetGiftDto> Gifts { get; set; }
    }
    public class CreateCategorDto
    {
        [Required]
        public string Name { get; set; }
    }
    public class UpdateCategoryDto
    {
        [Required]
        public int Id { get; set; }   
        [Required]
        public string Name { get; set; }
    }
}
