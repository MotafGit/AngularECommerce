using System;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities;

public class AppUser : IdentityUser
{
    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public UserAddress? Address { get; set; }

    public string? cartID { get; set; }


}
