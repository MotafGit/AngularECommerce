using System;
using Core.Entities;

namespace Core.Interfaces;

public interface ICartService
{
    Task<ShoppingCart?> GetCartAsync(string id);

    Task<ShoppingCart?> SetCartAsync(ShoppingCart cart, string? email);

    Task<bool> DeleteCartAsync(string id); 

//    Task<bool> DeleteProductFromCart(int id); 




    


}
