using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

public class Payment : BaseEntity
{ 
    [ForeignKey("Customer")]
    public string? CustomerId { get; set; }

    public PaymentType? PaymentType {get;set;}

    public AppUser? Customer {get;set;}

    [ForeignKey("ShoppingCart")]
    public string? ShoppingCartId { get; set; }
    public ShoppingCart? ShoppingCart {get;set;}

    public required decimal TotalPrice {get;set;}

    public string? PaymentStatus {get;set;}


}
