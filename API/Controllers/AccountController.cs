using System;
using System.Security.Claims;
using API.DTO;
using API.Extensions;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(SignInManager<AppUser> signInManager) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult> Register (RegisterDto registerDto)
    {
            var user = new AppUser
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                UserName = registerDto.Email,
            };

            var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

            if(!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
            return ValidationProblem();
            }

            return Ok();
    }
    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult> Logout(){
        await signInManager.SignOutAsync();

        return NoContent();
    }

    [HttpGet("user-info")]
    public async Task<ActionResult> GetUserInfo()
    {
        if (User.Identity?.IsAuthenticated == false) return NoContent();

        var user = await signInManager.UserManager.GetUserByWithAddress(User);

        return Ok(new 
        {
            user.FirstName,
            user.LastName,
            user.Email,
            Address = user.Address?.ToDto(),
            user.cartID
        });
    }

    [HttpGet("auth-status")]
    public ActionResult GetAuthState()
    {
        return Ok (new {IsAuthenticated = User.Identity?.IsAuthenticated ?? false});
    }

    [Authorize]
    [HttpPost("address")]
    public async Task<ActionResult<UserAddress>> CreateOrUpdateAddress(AddressDto address){
        
        var user = await signInManager.UserManager.GetUserByWithAddress(User);

        if (user.Address == null)
        {
            user.Address = address.ToEntity();
        }
        else
        {
            user.Address.UpdateFromDto(address);
        }

        var res = await signInManager.UserManager.UpdateAsync(user);

        if(!res.Succeeded) return BadRequest("Error updating user address");

        return Ok(user.Address.ToDto());
    }

}
