using System;
using Core.Entities;

namespace Core.Specification;

public class BrandsSpecification : BaseSpecification<Brands, Brands>
{
    public BrandsSpecification()
    {
        AddSelect(x => x);
       // ApplyDistinct();
    }
}
