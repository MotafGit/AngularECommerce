using System;
using Core.Entities;
using Core.Interfaces;
using Core.Specification;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Extensions;

namespace API.Controllers;


[ApiController]
[Route("api/[controller]")]

public class OrderController(SignInManager<AppUser> signInManager,IUsersService userService, IGenericRepository<Order> repo, StoreContext context, IOrdersService orderService) : ControllerBase
{
     [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(Order order) 
    {
        var user = await signInManager.UserManager.GetUserByWithAddress(User);
        if (user == null)
        {
            return BadRequest("User was not found");
        }
        order.UserId = user.Id;
        order.OrderDate = DateTime.Now;
        var res = await orderService.SetOrder(order);
        if ( res == "success")
        {
            if (await repo.SaveAllAsync())
            {
                return Ok();
            }
        }

        return BadRequest(res);
    }

    
    [HttpGet("{email}")] 
     public async Task<ActionResult<List<Order>>> GetOrders(string email) 
     {
        var user = await signInManager.UserManager.FindByEmailAsync(email);
         // var order = await repo.GetByStringIdAsyncWithIncludes( userId ,[ x => x.OrderProductsNavigation]);
        //  var order = await context.Orders
        //     .Include (x => x.OrderProductsNavigation)
        //     .Where(z => z.UserId.Equals(userId)).ToListAsync();
        var order = await context.Orders
            .Where(z => z.UserId == user.Id.ToString())
            .Select(z => new Order
            {
               OrderPrice = z.OrderPrice,
               OrderDate = z.OrderDate,
              // UserId = z.UserId,
                OrderProductsNavigation = (ICollection<OrderProduct>)z.OrderProductsNavigation.Select(op => new OrderProduct
                {
                   OrderId = op.OrderId,
                   Quantity = op.Quantity,
                   ProductNavigation = new Product
                    {
                        Name = op.ProductNavigation.Name,
                        Description = op.ProductNavigation.Description,
                        Price = op.ProductNavigation.Price,
                        PictureUrl = op.ProductNavigation.PictureUrl
                    }

                   
                    // include needed properties
                }).ToList()
            }
            ).ToListAsync();

        // var product = await repo.GetByIdAsync(id);
        
        if (order == null) return NotFound();
        return order;
     }
}

        

