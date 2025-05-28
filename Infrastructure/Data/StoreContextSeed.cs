using System;
using System.Reflection;
using System.Text.Json;
using Core.Entities;

namespace Infrastructure.Data;

public class StoreContextSeed
{


    public static async Task SeedAsync (StoreContext context){

    var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

      
        

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
        if (!context.BrandsTypes.Any()){
            var brandsType = await File.ReadAllTextAsync(path + @"/Data/SeedData/BrandsType.json");

            var bTypes = JsonSerializer.Deserialize<List<BrandsTypes>>(brandsType);

            if (bTypes == null) return;

            context.BrandsTypes.AddRange(bTypes);

            await context.SaveChangesAsync();                                                               
        }
        if (!context.Brands.Any()){
            var brands = await File.ReadAllTextAsync(path + @"/Data/SeedData/Brands.json");

            var b = JsonSerializer.Deserialize<List<Brands>>(brands);

            if (b == null) return;

            context.Brands.AddRange(b);

            await context.SaveChangesAsync();                                                               
        }
        if (!context.TypesType.Any()){
            var TypesType = await File.ReadAllTextAsync(path + @"/Data/SeedData/TypesType.json");

            var types = JsonSerializer.Deserialize<List<TypesType>>(TypesType);

            if (types == null) return;

            context.TypesType.AddRange(types);

            await context.SaveChangesAsync();                                                               
        }
        if (!context.Types.Any()){
            var Types = await File.ReadAllTextAsync(path + @"/Data/SeedData/Types.json");

            var t = JsonSerializer.Deserialize<List<Types>>(Types);

            if (t == null) return;

            context.Types.AddRange(t);

            await context.SaveChangesAsync();                                                               
        }
          if (!context.Products.Any()){
            var productsData = await File.ReadAllTextAsync(path + @"/Data/SeedData/products.json");

            var products = JsonSerializer.Deserialize<List<Product>>(productsData);

            if (products == null) return;

            context.Products.AddRange(products);

            await context.SaveChangesAsync();                                                               
        }
    }
        
}
