using System;
using System.Reflection;
using System.Text.Json;
using Core.Entities;

namespace Infrastructure.Data;

public class StoreContextSeed
{


    public static async Task SeedAsync (StoreContext context){

    var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        if (!context.Products.Any()){
            var productsData = await File.ReadAllTextAsync(path + @"/Data/SeedData/products.json");

            var products = JsonSerializer.Deserialize<List<Product>>(productsData);

            if (products == null) return;

            context.Products.AddRange(products);

            await context.SaveChangesAsync();                                                               
        }
        

        if (!context.Delivery.Any()){
            var deliveryData = await File.ReadAllTextAsync(path + @"/Data/SeedData/delivery.json");

            var delivery = JsonSerializer.Deserialize<List<Delivery>>(deliveryData);

            if (delivery == null) return;

            context.Delivery.AddRange(delivery);

            await context.SaveChangesAsync();                                                               
        }
        if (!context.PaymentTypes.Any()){
            var paymentsData = await File.ReadAllTextAsync(path + @"/Data/SeedData/paymentTypes.json");

            var payment = JsonSerializer.Deserialize<List<PaymentType>>(paymentsData);

            if (payment == null) return;

            context.PaymentTypes.AddRange(payment);

            await context.SaveChangesAsync();                                                               
        }
    }
        
}
