using System;
using System.Text.Json;
using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;

namespace Infrastructure.Services;

public class CartService(IConnectionMultiplexer redis) : ICartService
{

    private readonly IDatabase _database = redis.GetDatabase();

    public async Task<bool> DeleteCartAsync(string id)
    {
        return await _database.KeyDeleteAsync(id);
    }

    // public async Task<bool> DeleteProductFromCart(int id)
    // {
    //     
    // }

    public async Task<ShoppingCart?> GetCartAsync(string id)
    {
        var data = await _database.StringGetAsync(id);

        return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<ShoppingCart>(data!);
    }

    public async Task<ShoppingCart?> SetCartAsync(ShoppingCart cart)
    {
        // var data = await _database.StringGetAsync(cart.Id);
        
        // var dd = JsonSerializer.Deserialize<ShoppingCart>(data!);

        if (cart.Id.Equals("0")){
            var latestEntries = await _database.SortedSetRangeByRankAsync("cart_timestamps", -1);
            if (latestEntries.Length > 0)
            {
                var latestKey = latestEntries[0];
                // Retrieve the cart data
                var cartData = await _database.StringGetAsync(latestKey.ToString());
                if (cartData.HasValue)
                {
                     var cart1 = JsonSerializer.Deserialize<ShoppingCart>(cartData);
                    // // Use the cart object as needed
                    var auxInt = Convert.ToInt32(cart1.Id) + 1;
                    cart.Id = auxInt.ToString();
                }
            }
        }

        var created = await _database.StringSetAsync(cart.Id, JsonSerializer.Serialize(cart), TimeSpan.FromDays(30));

        await _database.SortedSetAddAsync("cart_timestamps", cart.Id, DateTimeOffset.UtcNow.ToUnixTimeSeconds());

        if (!created) return null;

        return await GetCartAsync(cart.Id);
    }
}
