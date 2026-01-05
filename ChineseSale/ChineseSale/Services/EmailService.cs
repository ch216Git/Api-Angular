using Microsoft.Extensions.Configuration;
using ChineseSale.Dtos;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace ChineseSale.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(EmailDto emailMessage)
        {
            var emailSettings = _config.GetSection("EmailSettings");

            using var client = new SmtpClient(emailSettings["SmtpHost"], int.Parse(emailSettings["SmtpPort"]))
            {
                Credentials = new NetworkCredential(emailSettings["SenderEmail"], emailSettings["SenderPassword"]),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(emailSettings["SenderEmail"], emailSettings["SenderName"]),
                Subject = emailMessage.Subject,
                Body = emailMessage.Body,
                IsBodyHtml = true
            };

            mailMessage.To.Add(emailMessage.To);

            await client.SendMailAsync(mailMessage);
        }
    }
}
