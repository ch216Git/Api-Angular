using ChineseSale.Models;
using System.ComponentModel.DataAnnotations;

namespace ChineseSale.Dtos
{
    public class GetDonorDto
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [EmailAddress]
        public string Email { get; set; }
        public string Phone { get; set; }
    }
    public class GetDonorByIdDto
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string Phone { get; set; }

        public List<GetGiftDto> Gifts { get; set; }
    }
    public class CreateDonorDto
    {
        [Required]
        public string Name { get; set; }

        [EmailAddress]
        public string Email { get; set; }
        public string Phone { get; set; }
    }
    public class UpdateDonorDto
    {
        [Required]
        public int Id { get; set; }
        public string Name { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public string Phone { get; set; }
    }


    }
