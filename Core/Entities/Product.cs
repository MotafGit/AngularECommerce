using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

public class Product : BaseEntity
{

    public required string Name { get; set; }
    public required string Description { get; set; }
    public decimal Price { get; set; }
    public required string PictureUrl { get; set; }
  
    [ForeignKey("TypeNavigation")]
    public int TypeId { get; set; }


    [ForeignKey("BrandNavigation")]
    public int BrandId { get; set; }
    public int QuantityInStock { get; set; }

    [Column(TypeName = "decimal(3,2)")]
    public decimal? AvgScore { get; set; }

    public virtual Types? TypeNavigation { get; set; }
    public virtual Brands? BrandNavigation { get; set; }

    public ICollection<OrderProduct> OrderProducts { get; set; } = new List<OrderProduct>();

    public ICollection<Reviews> Reviews { get; set; } = new List<Reviews>();




}
