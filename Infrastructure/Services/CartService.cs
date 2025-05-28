using System;
using System.Text.Json;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using StackExchange.Redis;

namespace Infrastructure.Services;

public class CartService(IConnectionMultiplexer redis, UserManager<AppUser> userManager) : ICartService
{

    private readonly IDatabase _database = redis.GetDatabase();

    public async Task<bool> DeleteCartAsync(string id)
    {
        // return await _database.KeyDeleteAsync(id); // for now delete items only and keep the cart
        var data = await _database.StringGetAsync(id);
        var cart = JsonSerializer.Deserialize<ShoppingCart>(data!);
        if (cart != null)
        {
        cart.Items= [];
        return await _database.StringSetAsync(cart?.Id, JsonSerializer.Serialize(cart));
        }
        else return false;
       
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

    public async Task<ShoppingCart?> SetCartAsync(ShoppingCart cart, string? email)
    {
        // var data = await _database.StringGetAsync(cart.Id);
        
        // var dd = JsonSerializer.Deserialize<ShoppingCart>(data!);
            var auxUser = new AppUser();
            StackExchange.Redis.SortedSetEntry[]? scores = null;
            bool created  = false;
        if (cart.Id.Equals("0") || cart.Id.Equals("null") ){
            var highestKey = await _database.SortedSetRangeByRankAsync("cart_timestamps", 0, 0, order: Order.Descending);
            if (highestKey.Length > 0)
            {

                var aux = highestKey.First().ToString();
                var auxInt =  Convert.ToInt32(aux) + 1;
                cart.Id = auxInt.ToString();
                 var highestKeyAndScore = highestKey.First();

            }
            else
            {
                cart.Id = "1";
            }
            await _database.SortedSetAddAsync("cart_timestamps", cart.Id, DateTimeOffset.UtcNow.ToUnixTimeSeconds());
        }

        if (!string.IsNullOrEmpty(email))
        {
            auxUser = await userManager.FindByEmailAsync(email);
            if (auxUser != null)
            {
                if(auxUser.cartID == null)
                {
                    auxUser.cartID = cart.Id;
                    await userManager.UpdateAsync(auxUser);
                }
                else{
                    cart.Id = auxUser.cartID!;
                    // var getCart = GetCartAsync(cart.Id);
                    // if (getCart.Result == null){
                    //     scores = _database.SortedSetRangeByRankWithScores("cart_timestamps", 0, 0, Order.Ascending);
                    //      await _database.SortedSetAddAsync("cart_timestamps", cart.Id, scores[0].Score - 1 );
                    // }
                }
            }
             created = await _database.StringSetAsync(cart.Id, JsonSerializer.Serialize(cart), TimeSpan.FromDays(7));
        }
        else
        {
             created = await _database.StringSetAsync(cart.Id, JsonSerializer.Serialize(cart));
        }

        // if(scores == null)
        // {
        //     await _database.SortedSetAddAsync("cart_timestamps", cart.Id, DateTimeOffset.UtcNow.ToUnixTimeSeconds());
        // }
        // else
        // {
        //     await _database.SortedSetAddAsync("cart_timestamps", cart.Id, scores[0].Score - 1 );
        // }
        

        // await _database.SortedSetAddAsync("cart_timestamps", cart.Id, 1);


        if (!created) return null;

        return await GetCartAsync(cart.Id);
    }
}
