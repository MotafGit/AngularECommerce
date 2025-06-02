using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Core.Entities;

public class Order : BaseEntity
{
    [Column(TypeName = "decimal(18,2)")]
    public decimal OrderPrice {get;set;}

    public DateTime OrderDate {get;set;}

    [ForeignKey("AppUser")]
    public string? UserId {get;set;}


    public virtual AppUser? UserNavigation {get;set;}

    public virtual ICollection<OrderProduct> OrderProductsNavigation { get; set; } = new List<OrderProduct>();

}
