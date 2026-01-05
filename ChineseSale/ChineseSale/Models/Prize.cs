using System.ComponentModel.DataAnnotations;

namespace ChineseSale.Models
{
    public class Prize
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }
        public User User { get; set; }

        [Required]
        public int GiftId { get; set; }
        public Gift Gift { get; set; }
    }
}
