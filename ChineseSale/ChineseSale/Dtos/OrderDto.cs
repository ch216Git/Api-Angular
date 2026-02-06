using ChineseSale.Models;
using System.ComponentModel.DataAnnotations;

namespace ChineseSale.Dtos
{
    public class GetOrderDto
    { 
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public int UserId { get; set; }
        public double Sum { get; set; }
    }
    public class GetOrderByIdDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public int UserId { get; set; }
        public List<GetGiftDto> gifts { get; set; } = new List<GetGiftDto>();
        public List<GetPackageDto> packages { get; set; }= new List<GetPackageDto>();
        public double Sum { get; set; }
    }
    public class CreatOrdeDto
    {
        public DateTime OrderDate { get; set; }
        [Required]
        public int UserId { get; set; }
        public List<int> GiftsId { get; set; } = new List<int>();
        public List<int> PackagesId { get; set; }= new List<int>();
        public double Sum { get; set; }
    }
}
