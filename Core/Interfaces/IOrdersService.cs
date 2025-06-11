using System;
using Core.Entities;

namespace Core.Interfaces;

public interface IOrdersService
{
    Task <bool> CheckStock(List<OrderProduct> products);

    Task <string> SetOrder(Order order);

    Task <RevenueAndOrdersDto?> GetRevenueAndNumberOfOrders();


}
