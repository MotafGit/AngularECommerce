using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

public class Brands : BaseEntity
{
    public required string BrandName {get;set;}

    [ForeignKey("BrandTypesNavigation")]
    public int BrandTypeId { get; set; }

    public virtual BrandsTypes? BrandTypesNavigation { get; set; }

}




