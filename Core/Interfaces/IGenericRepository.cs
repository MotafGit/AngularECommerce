using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Interfaces;

public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(int id);

    Task<T?> GetByIdAsyncWithIncludes(int id, Expression<Func<T, object>>[] includeExpressions);


    Task<IReadOnlyList<T>> ListAllAsync();

    Task<T?> GetEntityWithSpec(ISpecification<T> spec);

    Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);

    Task<TResult?> GetEntityWithSpec<TResult>(ISpecification<T,TResult> spec);

    Task<IReadOnlyList<TResult>> ListAsync<TResult>(ISpecification<T,TResult> spec);

    void Add (T entity);

    void Update (T entity);

    void Remove (T entity);

    Task <bool> SaveAllAsync();

    bool Exists (int id);

    Task<int> CounterAsync(ISpecification<T> spec);

    Task<int> GetHighestId(ISpecification<T> spec);

   

}
