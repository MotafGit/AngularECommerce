using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specification;

public class OrderSpecification : BaseSpecification<Order>
{
     public OrderSpecification( OrderSpecParams specParams ) : base(x =>
        string.IsNullOrEmpty(specParams.Search),
        new List<Expression<Func<Order, object>>>() 
    )
    {
        
    }
}
