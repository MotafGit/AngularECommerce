using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specification;

public class ProductSpecification : BaseSpecification<Product>
{
    public ProductSpecification( ProductSpecParams specParams ) : base(x =>
        (string.IsNullOrEmpty(specParams.Search) || x.Name.ToLower().Contains(specParams.Search)) &&
#pragma warning disable CS8602 // Dereference of a possibly null reference.
        ( specParams.Brands.Count == 0  ||  specParams.Brands.Contains(x.BrandNavigation.BrandName)) &&
#pragma warning restore CS8602 // Dereference of a possibly null reference.
#pragma warning disable CS8602 // Dereference of a possibly null reference.
        ( specParams.Types.Count == 0  ||  specParams.Types.Contains(x.TypeNavigation.TypeName)),
#pragma warning restore CS8602 // Dereference of a possibly null reference.
        new List<Expression<Func<Product, object>>>() 
    )
    {
        // working version, implement the right way when addinclude is needed
        if(specParams.Includes.Count > 0){ 
            foreach(var str in specParams.Includes)
            {
                var a = GenericExpression<Product>(str);
                AddInclude(a);
            }
        }
        

        ApplyPaging(specParams.PageSize * (specParams.PageIndex -1 ), specParams.PageSize);
        switch (specParams.Sort)
        {
            case "priceAsc":
                 AddOrderBy(x => x.Price);
                break;
            case "priceDesc":
                AddOrderByDescending(x => x.Price);
                break;
            case "orderByIdDesc":
                AddOrderByDescending(x => x.Id);
                break;
            default:
                AddOrderBy(x => x.Name);
                break;
        }
    }
}

