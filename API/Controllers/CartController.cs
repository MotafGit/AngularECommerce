using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class CartController(ICartService cartService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ShoppingCart>> GetCartById(string id)
    {
        var cart = await cartService.GetCartAsync(id);
        return Ok(cart ?? new ShoppingCart{Id = id});
    }

    [HttpPost]
    public async Task<ActionResult<ShoppingCart>> UpdateCart([FromBody] CartUpdateRequest request)
    {
        var updatedCart = await cartService.SetCartAsync(request.Cart, request.Email);
        if (updatedCart == null) return BadRequest ("Couldnt update card");
        return updatedCart;
    }


    [HttpDelete]
    public async Task<ActionResult> DeleteCart(string id){
        var result = await cartService.DeleteCartAsync(id);
        if (!result){return BadRequest("Couldnt delete cart");}

        return Ok();
    }

    // [HttpDelete("/deleteProductFromCart/{id}")]
    // public async Task<ActionResult> DeleteProductFromCart(int id){
    //     var result = await cartService.DeleteProductFromCart(id);
    //     if (!result){return BadRequest("Couldnt delete product from cart");}

    //     return Ok();
    // }

    public class CartUpdateRequest
    {
        public required ShoppingCart Cart { get; set; }
        public string? Email { get; set; }
    }

}
