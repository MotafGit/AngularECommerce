using System;
using System.Linq.Expressions;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class GenericRepository<T>(StoreContext context) : IGenericRepository<T> where T : BaseEntity
{
    public void Add(T entity)
    {
        context.Set<T>().Add(entity);
    }

    public async Task<int> CounterAsync(ISpecification<T> spec)
    {
        var query = context.Set<T>().AsQueryable();

        query = spec.ApplyCriteria(query);
        
        return await query.CountAsync();
    }


    public async Task<int> GetHighestId(ISpecification<T> spec)
    {
        return (int)await context.Set<T>().MaxAsync(e => e.Id); 
    }


    public bool Exists(int id)
    {
        return context.Set<T>().Any(x => x.Id == id);
    }

    public  async Task<T?> GetByIdAsync(int id)
    {
        return await context.Set<T>().FindAsync(id);
    }

        public  async Task<T?> GetByIdAsyncWithIncludes(int id, params Expression<Func<T, object>>[] includeExpressions)
    {
        IQueryable<T> query = context.Set<T>();
        
        foreach (var includeExpression in includeExpressions)
        {
        query = query.Include(includeExpression);
        }

        return await query.FirstOrDefaultAsync(e => EF.Property<int>(e, "Id") == id);
    }

    public async Task<T?> GetEntityWithSpec(ISpecification<T> spec)
    {
        return await ApplySpecification(spec).FirstOrDefaultAsync();
    }
        public async Task<TResult?> GetEntityWithSpec<TResult>(ISpecification<T,TResult> spec)
    {
        return await ApplySpecification(spec).FirstOrDefaultAsync();
    }

    public async Task<IReadOnlyList<T>> ListAllAsync()
    {
        return await context.Set<T>().ToListAsync();
    }

    public async Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec)
    {
        return await ApplySpecification(spec).ToListAsync();
    }

       public async Task<IReadOnlyList<TResult>> ListAsync<TResult>(ISpecification<T,TResult> spec)
    {
        return await ApplySpecification(spec).ToListAsync();
    }
 
    public void Remove(T entity)
    {
        context.Set<T>().Remove(entity);
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public void Update(T entity)
    {
        var existingEntity = context.Set<T>().Find(entity.Id);
        if (existingEntity != null)
        {
            context.Entry(existingEntity).State = EntityState.Modified;
            context.Entry(existingEntity).CurrentValues.SetValues(entity);
            
        }

        //  context.Set<T>().Attach(entity);
        //  context.Entry(entity).State = EntityState.Modified;

    }


    private IQueryable<T>ApplySpecification(ISpecification<T> spec)
    {
        return SpecificationEvaluator<T>.GetQuery(context.Set<T>().AsQueryable(), spec);
    }


    private IQueryable<TResult>ApplySpecification<TResult>(ISpecification<T,TResult> spec)
    {
        return SpecificationEvaluator<T>.GetQuery<T,TResult>(context.Set<T>().AsQueryable(), spec);
    }

    public async Task<T?> GetByStringIdAsyncWithIncludes(string id, Expression<Func<T, object>>[] includeExpressions)
    {
        IQueryable<T> query = context.Set<T>();
        
        foreach (var includeExpression in includeExpressions)
        {
            query = query.Include(includeExpression);
        }

        return await query.FirstOrDefaultAsync(e => EF.Property<string>(e, "Id").Equals(id));
    }
}
