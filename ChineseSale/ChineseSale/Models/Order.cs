using System.ComponentModel.DataAnnotations;

namespace ChineseSale.Models
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }

        [Required]
        public int UserId { get; set; }
        public User User { get; set; }

        public List<int> GiftsId { get; set; } = new List<int>();

        public double Sum { get; set; }
    }
}
