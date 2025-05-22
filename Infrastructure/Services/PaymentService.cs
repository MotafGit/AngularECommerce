using System;
using System.Runtime.CompilerServices;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services;

public class PaymentService(IConfiguration config, ICartService cartService,
    IGenericRepository<Product> productRepo, IGenericRepository<Delivery> deliveryRepo,
    IGenericRepository<Payment> paymentRepo1, IPaymentRepository paymentRepo, UserManager<AppUser> userManager) : IPaymentService
{
    public async Task AddPayment(Payment payment)
    {
        await paymentRepo.AddPayment(payment);
    }

    public async Task<ShoppingCart?> CreateOrUpdatePayment(string cartId, string userEmail)
    {
        var cart =  await cartService.GetCartAsync(cartId);
        if (cart == null) return null;

        var shippingPrice = 0m;

        if (cart.DeliveryMethodID.HasValue)
        {
            var delivery = await deliveryRepo.GetByIdAsync((int)cart.DeliveryMethodID);

            if (delivery == null) return null;

            shippingPrice = delivery.Price;
        }
        decimal Total = 0;
        foreach(var item in cart.Items)
        {
            var productItem = await productRepo.GetByIdAsync(item.ProductId);

            if (productItem == null) return null;

            if (item.Price != productItem.Price)
            {
                item.Price = productItem.Price;
            }

            Total = Total + item.Price;
        }


        // var testa = await paymentRepo.ListAllAsync();

        // var count = await paymentRepo.CounterAsync(paymentSpec);
            var customer = await userManager.FindByEmailAsync(userEmail);

            var pay = new Payment
            {
               
                CustomerId = customer?.Id.ToString(),
                ShoppingCartId = cart.Id,
                TotalPrice = 10.2m,
            };

            cart.PaymentIntentId = 1;
          //  cart.Total = Total;


                // public PaymentType? PaymentType {get;set;}


                // public AppUser? Customer {get;set;}

                // public ShoppingCart? ShoppingCart {get;set;}

                // public required decimal TotalPrice {get;set;}

         await AddPayment(pay);
        

        
        await cartService.SetCartAsync(cart, null);

        return cart;

    }


}
