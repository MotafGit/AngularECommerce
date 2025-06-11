using System;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore;
using Microsoft.EntityFrameworkCore;
namespace Infrastructure.Services;

public class OrdersService(IGenericRepository<Product> productRepo, IGenericRepository<Order> ordersRepo, StoreContext context) : IOrdersService
{
    public Task<bool> CheckStock(List<OrderProduct> products)
    {
        throw new NotImplementedException();
    }

    public async Task<RevenueAndOrdersDto?> GetRevenueAndNumberOfOrders()
    {
        var auxObj = await context.Orders
                        .GroupBy(_ => true)
                        .Select( g => new
                        {
                            TotalRevenue = g.Sum(p => p.OrderPrice),
                            TotalOrders = g.Count()
                        })
                        .FirstOrDefaultAsync();
        
        if (auxObj == null)
        {
            return new RevenueAndOrdersDto { TotalRevenue = 0m, TotalOrders = 0 };
        }

        return new RevenueAndOrdersDto { TotalRevenue = auxObj.TotalRevenue, TotalOrders = auxObj.TotalOrders };;
    }

    public async Task<string> SetOrder(Order order)
    {
        foreach ( var p in order.OrderProductsNavigation){
            if(p.ProductId.HasValue)
            {
                var auxP = await productRepo.GetByIdAsync(p.ProductId.Value);
                if (auxP == null){return "";}
                if ( auxP.QuantityInStock - p.Quantity >= 0)
                {
                    auxP.QuantityInStock =  auxP.QuantityInStock - p.Quantity;
                }
                else{
                    return $"Product {auxP.Name} only has {auxP.QuantityInStock} in stock and you have {p.Quantity} in your cart";
                }
            }
        }
        ordersRepo.Add(order);

        

        return "success";
    }
}


  