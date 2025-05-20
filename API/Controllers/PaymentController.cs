using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController(IPaymentService paymentService, IGenericRepository<Delivery> deliveryRepo, IGenericRepository<PaymentType> paymentTypesRepo) : ControllerBase
{
    [Authorize]
    [HttpPost("setUpPayment/{cartId}/{userEmail}")]
     public async Task<ActionResult<ShoppingCart>> SetUpPayment (string cartId, string userEmail){
        var cart = await paymentService.CreateOrUpdatePayment(cartId, userEmail);

        if (cart == null) return BadRequest ("Problem with the  cart");

        return Ok(cart);
     }

     [HttpGet("delivery")]
     public async Task<ActionResult<IReadOnlyList<Delivery>>> GetDelivery(){
        return Ok(await deliveryRepo.ListAllAsync());
     }

     [HttpGet("paymentTypes")]
     public async Task<ActionResult<IReadOnlyList<Delivery>>> GetPaymentTypes(){
        return Ok(await paymentTypesRepo.ListAllAsync());
     }
    
}
