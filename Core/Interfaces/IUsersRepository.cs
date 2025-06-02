using System;
using Core.Entities;

namespace Core.Interfaces;

public interface IUsersRepository
{
    Task<IReadOnlyList<object>>GetUsersWithAddress();

    Task<int>CounterAsync();

}
