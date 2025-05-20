using System;
using Core.Entities;

namespace Core.Interfaces;

public interface IPaymentRepository
{
    Task AddPayment (Payment payment);
}
