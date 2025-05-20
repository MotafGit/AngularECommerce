using System;
using Core.Entities;

namespace Core.Interfaces;

public interface IPaymentService
{
    Task<ShoppingCart?> CreateOrUpdatePayment( string cartId, string userEmail);

    Task AddPayment(Payment payment);
    
}
