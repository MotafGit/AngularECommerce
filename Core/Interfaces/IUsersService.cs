using System;
using Core.Entities;

namespace Core.Interfaces;

public interface IUsersService
{
    Task<IReadOnlyList<object>>GetUsers();

    Task<int>CounterAsync();

}
