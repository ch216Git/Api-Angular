using ChineseSale.Dtos;
using ChineseSale.Models;
using ChineseSale.Repositories;

namespace ChineseSale.Services
{
    public class OrderService: IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IGiftService _giftService;
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;
        private readonly IUserRepository _userRepository;
        public OrderService(IOrderRepository orderRepository , IGiftService giftService, IUserService userService, IEmailService emailService, IUserRepository userRepository)
        {
            _orderRepository = orderRepository;
            _giftService = giftService;
            _userService = userService;
            _emailService = emailService;
            _userRepository = userRepository;
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
                GetOrderByIdDto orderByIdDto = new GetOrderByIdDto()
                {
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
                GetOrderByIdDto orderByIdDto = new GetOrderByIdDto()
                {
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
                GiftsId = orderDto.GiftsId
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

        public async Task<IEnumerable<GetUserDto>> GetBuyerGift(int GiftId)
        {
            List<GetUserDto> users = new List<GetUserDto>();
            IEnumerable<Order> result = await _orderRepository.GetAllOrdersAsync();
            List<Order> orders = result.ToList();
            for (int i = 0; i < orders.Count(); i++)
            {
                if (orders[i].GiftsId.Contains(GiftId))
                {
                    GetUserDto userDto = await _userService.GetUserByIdAsync(orders[i].UserId);
                    users.Add(userDto);
                }

            }
            return users;
        }
    }
}
