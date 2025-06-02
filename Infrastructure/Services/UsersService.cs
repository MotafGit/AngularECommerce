using System;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Services;

public class UsersService( IUsersRepository repo) : IUsersService
{
    public async Task<int> CounterAsync()
    {
        return await repo.CounterAsync();
    }

    public async Task<IReadOnlyList<object>> GetUsers()
    {
        return await repo.GetUsersWithAddress();
    }
}
