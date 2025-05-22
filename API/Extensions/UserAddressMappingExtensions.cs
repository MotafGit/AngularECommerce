using System;
using API.DTO;
using Core.Entities;

namespace API.Extensions;

public static class UserAddressMappingExtensions
{
    public static AddressDto? ToDto(this UserAddress? address)
    {
        if (address == null) return null;

        return new AddressDto
        {
            Line1 = address.Line1,
            Line2 = address.Line2,
            City = address.City,
            District = address.District,
            Country = address.Country,
            PostalCode = address.PostalCode
        };
    }


     public static UserAddress ToEntity(this AddressDto addressDto)
    {
        if (addressDto == null) throw new ArgumentNullException(nameof(addressDto));

        return new UserAddress
        {
            Line1 = addressDto.Line1,
            Line2 = addressDto.Line2,
            City = addressDto.City,
            District = addressDto.District,
            Country = addressDto.Country,
            PostalCode = addressDto.PostalCode
        };
    }

    public static void UpdateFromDto(this UserAddress address, AddressDto addressDto)
    {
        if (addressDto == null) throw new ArgumentNullException(nameof(addressDto));
        if (address == null) throw new ArgumentNullException(nameof(address));


        address.Line1 = addressDto.Line1;
        address.Line2 = addressDto.Line2;
        address.City = addressDto.City;
        address.District = addressDto.District;
        address.Country = addressDto.Country;
        address.PostalCode = addressDto.PostalCode;
    }

   
}
