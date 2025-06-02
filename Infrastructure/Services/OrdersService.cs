using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore;
namespace Infrastructure.Services;

public class OrdersService(IGenericRepository<Product> productRepo, IGenericRepository<Order> ordersRepo) : IOrdersService
{
    public Task<bool> CheckStock(List<OrderProduct> products)
    {
        throw new NotImplementedException();
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


  