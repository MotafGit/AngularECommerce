using System;

namespace Core.Entities;

public class UserAddress : BaseEntity
{
    public required string Line1 { get; set; }

    public string? Line2 { get; set; }

    public required string City { get; set; }

    public required string District { get; set; }

    public required string PostalCode { get; set; }

    public required string Country { get; set; }



}
