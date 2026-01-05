using System.ComponentModel.DataAnnotations;

namespace ChineseSale.Dtos
{
    public class GetPrizeDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int GiftId { get; set; }
    }
    public class CreatePrizeDto
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public int GiftId { get; set; }
    }
}
