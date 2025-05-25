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
        if (cart.Id.Equals("0") || cart.Id.Equals("null")){
            var highestKey = await _database.SortedSetRangeByRankAsync("cart_timestamps", 0, -1, order: Order.Descending);
            if (highestKey.Length > 0)
            {
                // var cartData = await _database.StringGetAsync(highestKey.First().ToString());
                // if (cartData.HasValue)
                // {
                //      var cart1 = JsonSerializer.Deserialize<ShoppingCart>(cartData);
                //     cart.Id = cart1.Id;
                    
                // }


                var aux = highestKey.First().ToString();
                var auxInt =  Convert.ToInt32(aux) + 1;
                cart.Id = auxInt.ToString();
                //var latestKey = highestKey[0];
                 var highestKeyAndScore = highestKey.First();
                 // var highestKeyString = highestKeyAndScore.ToString();
               // var cartData = await _database.StringGetAsync(highestKeyAndScore.ToString());
                // if (cartData.HasValue)
                // {
                //      var cart1 = JsonSerializer.Deserialize<ShoppingCart>(cartData);
                   
                //    // var auxInt = Convert.ToInt32(cart1.Id) + 1;
                //     //cart.Id = auxInt.ToString();

                    
                // }
                // else{

                // }
            }
            else
            {
                cart.Id = "1";
            }
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
                }
            }
        }

        var created = await _database.StringSetAsync(cart.Id, JsonSerializer.Serialize(cart));
        

        // if(auxUser != null)
        // {
        //     auxUser.cartID = cart.Id;
        //     await userManager.UpdateAsync(auxUser);
        // }

        //     public static async Task<AppUser> GetUserByEmail(this UserManager<AppUser> userManager, ClaimsPrincipal user){
        // var userToReturn = await userManager.Users.FirstOrDefaultAsync( x => x.Email == user.GetEmail());

        // if (userToReturn == null) throw new AuthenticationException("User was not found");

        // return userToReturn;
    

        //   return new UserAddress
        // {
        //     Line1 = addressDto.Line1,
        //     Line2 = addressDto.Line2,
        //     City = addressDto.City,
        //     District = addressDto.District,
        //     Country = addressDto.Country,
        //     PostalCode = addressDto.PostalCode
        // };
        // var res = await signInManager.UserManager.UpdateAsync(user);



        await _database.SortedSetAddAsync("cart_timestamps", cart.Id, DateTimeOffset.UtcNow.ToUnixTimeSeconds());

        if (!created) return null;

        return await GetCartAsync(cart.Id);
    }
}
