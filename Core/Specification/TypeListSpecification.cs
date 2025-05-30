using System;
using Core.Entities;

namespace Core.Specification;

public class TypeListSpecification : BaseSpecification<Product, string>
{
    public  TypeListSpecification ()
    {
#pragma warning disable CS8602 // Dereference of a possibly null reference.
        AddSelect(x => x.TypeNavigation.TypeName);
#pragma warning restore CS8602 // Dereference of a possibly null reference.
        ApplyDistinct();
    }
}
