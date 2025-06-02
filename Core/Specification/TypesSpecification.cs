using System;
using Core.Entities;

namespace Core.Specification;

public class TypesSpecification :  BaseSpecification<Types, Types>
{
    public TypesSpecification()
    {
        AddSelect(x => x);
    }
}

