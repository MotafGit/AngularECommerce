using System;
using Core.Entities;

namespace Core.Specification;

public class BrandListSpecification : BaseSpecification<Product, string>
{

    public BrandListSpecification()
    {
#pragma warning disable CS8602 // Dereference of a possibly null reference.
        AddSelect(x => x.BrandNavigation.BrandName);
#pragma warning restore CS8602 // Dereference of a possibly null reference.
        ApplyDistinct();
    }

}
