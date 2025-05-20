using System;

namespace Core.Entities;

public class ShoppingCart
{
    public required string Id { get; set; }

    public List<CartItem> Items { get; set; } = [];

    public int? DeliveryMethodID {get;set;}

    public string? ClientSecret {get;set;}

    public int? PaymentIntentId {get;set;}

    public decimal Total {get;set;}

     public List<Payment> Payments { get; set; } = [];



}
