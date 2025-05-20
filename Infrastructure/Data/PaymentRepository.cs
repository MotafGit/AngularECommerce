using System;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data;

public class PaymentRepository(StoreContext context) : IPaymentRepository
{
    public async Task AddPayment(Payment payment)
    {
         context.Payment.Add(payment);
          await context.SaveChangesAsync();
    }


}
