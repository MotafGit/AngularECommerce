using System;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure;

public class ProductRepository(StoreContext context) : IProductRepository
{

    public void AddProduct(Product product)
    {
        context.Products.Add(product);
    }

    public void DeleteProduct(Product product)
    {
        context.Products.Remove(product);
    }

    public Task<IReadOnlyList<string>> GetBrandsAsync()
    {
        throw new NotImplementedException();
    }

    // public async Task<IReadOnlyList<string>> GetBrandsAsync() 
    // {
    //     return await context.Products.Select(z => z.Brand)
    //     .Distinct()
    //     .ToListAsync();
    // }

    public async Task<object?> GetProduct(int id)
    {
        // return await context.Products.FindAsync(id);

    return context.Products
    .Include(x => x.BrandNavigation)
    .Include(x => x.TypeNavigation)
    .Include(x => x.Reviews)
        .ThenInclude(r => r.UserNavigation)
    .Where(x => x.Id == id)
    .Select(x => new
    {
        x.Id,
        x.Name,
        x.Description,
        x.Price,
        x.PictureUrl,
        x.TypeId,
        x.BrandId,
        x.QuantityInStock,
        x.AvgScore,
        TypeNavigation = new
        {
            x.TypeNavigation!.TypeName,
            x.TypeNavigation.TypesTypeId,
            x.TypeNavigation.Id
        },
        BrandNavigation = new
        {
            x.BrandNavigation!.BrandName,
            x.BrandNavigation.BrandTypeId,
            x.BrandNavigation.Id
        },
        Reviews = x.Reviews.Select(r => new
        {
            r.Id,
            r.Comment,
            r.Score,
            r.ReviewData,
            r.Title,
            FirstName = r.UserNavigation!.FirstName,
            LastName = r.UserNavigation.LastName
        }).ToList()
    })
    .FirstOrDefault();

    }

    public async Task<IReadOnlyList<Product>> GetProducts()
    {
        return await context.Products.ToListAsync();
    }

    public async Task<IReadOnlyList<Product>> GetProducts(string? brands, string? type, string? sort)
    {
        IQueryable<Product>? query = null;
        // if (!string.IsNullOrWhiteSpace(brands)){
        //     query = context.Products.Where(x => x.Brand == brands);
        // }
        // if (!string.IsNullOrWhiteSpace(type)){
        //     query = context.Products.Where(x => x.Type == type);
        // }
        if (string.IsNullOrWhiteSpace(brands) && string.IsNullOrWhiteSpace(type)){
            query = context.Products;
        }
        if (query != null)
        {
            query = sort switch
            {
                "priceAsc" => query.OrderBy(x => x.Price),
                "priceDesc" => query.OrderByDescending(x => x.Price),
                _ => query.OrderBy(x => x.Name)
            };
            return await query.ToListAsync();

        }
         return new List<Product>().AsReadOnly();
       

        
    }

    public Task<IReadOnlyList<string>> GetTypesAsync()
    {
        throw new NotImplementedException();
    }

    // public async Task<IReadOnlyList<string>> GetTypesAsync()
    // {
    //     return await context.Products.Select(z => z.Type)
    //     .Distinct()
    //     .ToListAsync();
    // }

    public bool ProductExists(int id)
    {
        return context.Products.Any(x => x.Id == id);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public void UpdateProduct(Product product)
    {
        context.Entry(product).State = EntityState.Modified;
    }


}
