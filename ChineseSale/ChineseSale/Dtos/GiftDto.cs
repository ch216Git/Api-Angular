using ChineseSale.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ChineseSale.Dtos
{
    public class GetGiftDto
  
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public int Value { get; set; }
        //public int PriceCard { get; set; }
        public GetCategoryDto Category { get; set; }
        public GetDonorDto Donor { get; set; }
        //public TypeCard TypeCard { get; set; }
        public int SumCustomers { get; set; }
    }
    public class CreateGiftDto
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public int Value { get; set; }
        //[Required]
        //public int PriceCard { get; set; }
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public int DonorId { get; set; }
        //public TypeCard TypeCard { get; set; }

    }
    public class UpdateGiftDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public int Value { get; set; }

        //[Required]
        //public int PriceCard { get; set; }
        //public TypeCard TypeCard { get; set; }

        [Required]
        public int CategoryId { get; set; }


        [Required]
        public int DonorId { get; set; }
    }

}
