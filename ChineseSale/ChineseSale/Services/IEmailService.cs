using ChineseSale.Dtos;
namespace ChineseSale.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(EmailDto emailMessage);
    
    }
}
