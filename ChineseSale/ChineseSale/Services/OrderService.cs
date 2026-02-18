using ChineseSale.Dtos;
using ChineseSale.Models;
using ChineseSale.Repositories;
using Org.BouncyCastle.Bcpg;
using System.Text;

namespace ChineseSale.Services
{
    public class OrderService: IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IGiftService _giftService;
        private readonly IUserService _userService;
        private readonly IPackageService _packageService;
        private readonly IEmailService _emailService;
        private readonly IUserRepository _userRepository;
        public OrderService(IOrderRepository orderRepository , IGiftService giftService, IUserService userService, IEmailService emailService, IUserRepository userRepository, IPackageService packageService)
        {
            _orderRepository = orderRepository;
            _giftService = giftService;
            _userService = userService;
            _emailService = emailService;
            _userRepository = userRepository;
            _packageService = packageService;

        }
        public async Task<IEnumerable<GetOrderDto>> GetAllOrderAsync()
        {
            IEnumerable<Order> orders = await _orderRepository.GetAllOrdersAsync();
            List<GetOrderDto> orderDtos = new List<GetOrderDto>();
            foreach (var order in orders)
            {
                GetOrderDto orderDto = new GetOrderDto()
                {
                    Id = order.Id,
                    UserId = order.UserId,
                    OrderDate = order.OrderDate,
                    Sum = order.Sum
                };
                orderDtos.Add(orderDto);
            }
            return orderDtos;
        }
        public async Task<GetOrderByIdDto?> GetOrderByIdAsync(int Id)
        {
            Order order = await _orderRepository.GetOrderByIdAsync(Id);

            if (order != null)
            {
                List<GetGiftDto> giftsDto = new List<GetGiftDto>();
                for (int i = 0; i < order.GiftsId.Count(); i++)
                {
                    GetGiftDto giftDto = await _giftService.GetByIdGiftAsync(order.GiftsId[i]);
                    giftsDto.Add(giftDto);
                }
                List<GetPackageDto> packagesDto = new List<GetPackageDto>();
                for (int i = 0; i < order.PackagesId.Count(); i++)
                {
                    GetPackageDto packageDto = await _packageService.GetPackageByIdAsync(order.PackagesId[i]);
                    packagesDto.Add(packageDto);
                }
                GetOrderByIdDto orderByIdDto = new GetOrderByIdDto()
                {
                    Id = order.Id,
                    UserId = order.UserId,
                    OrderDate = order.OrderDate,
                    gifts = giftsDto,
                    packages= packagesDto,
                    Sum = order.Sum
                };
                return orderByIdDto;
            }
            else
                throw new ArgumentException("order not found");
        }
        public async Task<GetOrderByIdDto?> GetOrderByUserIdAsync(int UserId)
        {
            Order order = await _orderRepository.GetOrderByUserIdAsync(UserId);

            if (order != null)
            {
                List<GetGiftDto> giftsDto = new List<GetGiftDto>();
                for (int i = 0; i < order.GiftsId.Count(); i++)
                {
                    GetGiftDto giftDto = await _giftService.GetByIdGiftAsync(order.GiftsId[i]);
                    giftsDto.Add(giftDto);
                }
                List<GetPackageDto> packagesDto = new List<GetPackageDto>();
                for (int i = 0; i < order.PackagesId.Count(); i++)
                {
                    GetPackageDto packageDto = await _packageService.GetPackageByIdAsync(order.PackagesId[i]);
                    packagesDto.Add(packageDto);
                }
                GetOrderByIdDto orderByIdDto = new GetOrderByIdDto()
                {
                    packages = packagesDto,
                    Id = order.Id,
                    UserId = order.UserId,
                    gifts = giftsDto,
                    Sum = order.Sum
                };
                return orderByIdDto;
            }
            else
                throw new ArgumentException("order not found");
        }
        public async Task<GetOrderByIdDto> CreateOrderAsync(CreatOrdeDto orderDto)
        {
            var user = await _userRepository.GetUserByIdAsync(orderDto.UserId);
            if (user == null)
                throw new Exception("User not found");
            Order order = new Order()
            {
                UserId = orderDto.UserId,
                OrderDate = orderDto.OrderDate,
                Sum = orderDto.Sum,
                GiftsId = orderDto.GiftsId,
                PackagesId= orderDto.PackagesId
            };

            await _orderRepository.CreateOrderAsync(order);

            //var emailMessage = new EmailDto()
            //{
            //    To = order.User.Email,
            //    Subject = "Your Order Confirmation",
            //    Body = $"Hello {order.User.UserName},<br>Your order with ID {order.Id} was successfully placed!"
            //};

            //await _emailService.SendEmailAsync(emailMessage);

            return await GetOrderByIdAsync(order.Id);
        }

        public async Task<IEnumerable<GetUserDto>> GetBuyerGift(int giftId)
        {
            List<GetUserDto> users = new List<GetUserDto>();
            IEnumerable<Order> result = await _orderRepository.GetAllOrdersAsync();
            List<Order> orders = result.ToList();
            for (int i = 0; i < orders.Count(); i++)
            {
                for (int j = 0; j < orders[i].GiftsId.Count(); j++) { 
                    if (orders[i].GiftsId[j]==giftId)
                {
                    GetUserDto userDto = await _userService.GetUserByIdAsync(orders[i].UserId);
                    users.Add(userDto);
                }
                }

            }
            return users;
        }
        public async Task<double> SumSale()
        {
            double totalSum = 0;

            IEnumerable<GetOrderDto> orders = await GetAllOrderAsync();


            foreach (var order in orders)
            {
                totalSum += order.Sum;
            }

            return totalSum;
        }
        public async Task<byte[]> ExportSumToCsvAsync()
        {
            // קבלת הסכום הכולל
            var sum = await SumSale();

            // יצירת תוכן ה-CSV בצורה נכונה
            StringBuilder csvContent = new StringBuilder();
            csvContent.AppendLine("Sum"); // כותרת העמודה
            csvContent.AppendLine(sum.ToString()); // הנתון

            // המרת התוכן למערך בייטים
            return Encoding.UTF8.GetBytes(csvContent.ToString());
        }
    }
}
