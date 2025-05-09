using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTO;

public class ProductDto
{
    [Required]
    public  string Name { get; set; } = string.Empty;

    [Required]
    public  string Description { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "PRice must be greater then 0")]
    public decimal Price { get; set; }

    [Required]
    public  string PictureUrl { get; set; }  = string.Empty;

     [Required]
    public  string Type { get; set; } = string.Empty;

     [Required]
    public  string Brand { get; set; } = string.Empty;

    [Range(0, int.MaxValue, ErrorMessage = "stock must be zero or greater")]
    public int QuantityInStock { get; set; }
}
