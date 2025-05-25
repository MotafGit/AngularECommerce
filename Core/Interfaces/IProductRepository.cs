using System;
using Core.Entities;

namespace Core.Interfaces;

public interface IProductRepository
{
    Task<IReadOnlyList<Product>>GetProducts(string? brands, string? type, string? sort);

    Task<Product?> GetProduct(int id);

    Task<IReadOnlyList<string>> GetBrandsAsync();

    Task<IReadOnlyList<string>> GetTypesAsync();


    void AddProduct(Product product);

    void UpdateProduct(Product product);

    void DeleteProduct(Product product);

    bool ProductExists(int id);


    Task<bool> SaveChangesAsync();
}
