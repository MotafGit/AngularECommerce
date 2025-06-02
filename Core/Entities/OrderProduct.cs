using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Core.Entities;

public class OrderProduct : BaseEntity
{
    [ForeignKey("Order")]
    public int? OrderId { get; set; }
    public virtual Order? OrderNavigations { get; set; }

    [ForeignKey("Product")]
    public int? ProductId { get; set; }
    public virtual Product? ProductNavigation { get; set; }

    public required int Quantity{get;set;}
}
