using ChineseSale.Models;
using System.ComponentModel.DataAnnotations;

namespace ChineseSale.Dtos
{
    public class GetBasketDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public double Sum { get; set; }
    }
    public class GetBasketByUserIdDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public List<GetGiftDto> gifts { get; set; }
        public List<GetPackageDto> packages { get; set; }
        public double Sum { get; set; }
    }
    public class CreateBasketDto
    {
        [Required]
        public int UserId { get; set; }
    }
    public class  AddGiftToBasketDto
    {
        public int BasketId { get; set; }
        public int giftId { get; set; }
    }
    public class DeleteGiftFromBasketDto
    {
        public int BasketId { get; set; }
        public int giftId { get; set; }
    }
    public class AddPackageToBasketDto
    {
        public int BasketId { get; set; }
        public int packageId { get; set; }
    }
    public class DeletePackageFromBasketDto
    {
        public int BasketId { get; set; }
        public int packageId { get; set; }
    }
}
