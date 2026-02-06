using System.ComponentModel.DataAnnotations;

namespace ChineseSale.Models
{
    //public enum TypeCard
    //{
    //    Special,
    //    Normal
    //}
    public class Gift
    {

        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public int Value { get; set; }

        //[Required]
        //public int PriceCard { get; set; }
        //public TypeCard TypeCard { get; set; } = TypeCard.Normal;

        [Required]
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        [Required]
        public int DonorId { get; set; }
        public Donor Donor { get; set; }
        public int SumCustomers { get; set; } = 0;



    }
}
