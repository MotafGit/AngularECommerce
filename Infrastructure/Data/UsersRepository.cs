using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class UsersRepository (UserManager<AppUser> userManager) : IUsersRepository
{
    public async Task<int> CounterAsync()
    {
        return await userManager.Users.CountAsync();
    }

    public async Task<IReadOnlyList<object>>GetUsersWithAddress()
    {
        return await userManager.Users
            .Include( x => x.Address)
            .Select( x => new 
            {
           x.FirstName, x.LastName, x.Email, x.Address, x.cartID
            })
            .ToListAsync();
    }


    //     public async Task<IReadOnlyList<object>>GetUsersWithAddress()
    // {
    //     return await userManager.Users
    //         .Include( x => x.Address)
    //         .Select( x => new
    //         {
    //             x.FirstName, x.LastName, x.Address, x.cartID
    //         })
    //         .ToListAsync();
    // }
    
}


