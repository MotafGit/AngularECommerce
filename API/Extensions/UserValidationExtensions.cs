using System;
using System.Security.Authentication;
using System.Security.Claims;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class UserValidationExtensions
{

    public static async Task<AppUser> GetUserByEmail(this UserManager<AppUser> userManager, ClaimsPrincipal user){
        var userToReturn = await userManager.Users.FirstOrDefaultAsync( x => x.Email == user.GetEmail());

        if (userToReturn == null) throw new AuthenticationException("User was not found");

        return userToReturn;
    }

        public static async Task<AppUser> GetUserByWithAddress(this UserManager<AppUser> userManager, ClaimsPrincipal user){
        var userToReturn = await userManager.Users
        .Include(z => z.Address)
        .FirstOrDefaultAsync( x => x.Email == user.GetEmail());

        if (userToReturn == null) throw new AuthenticationException("User was not found");

        return userToReturn;
    }


    public static string GetEmail (this ClaimsPrincipal user)
    {
        var email = user.FindFirstValue(ClaimTypes.Email)
            ?? throw new AuthenticationException("GetEmail Error");

        return email;
    }

}
