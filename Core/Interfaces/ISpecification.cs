using System;
using System.Linq.Expressions;

namespace Core.Interfaces;

public interface ISpecification<T> where T : class
{
    Expression<Func<T,bool>>? Criteria {get; }

    List<Expression<Func<T, object>>> Includes { get; }

    Expression<Func<T,object>>? OrderBy {get; }

    Expression<Func<T,object>>? OrderByDescending {get; }

    Expression<Func<T, object>> GenericExpression<T>( string navigation);

    bool isDistinct {get;}

    int Take {get;}

    int Skip{get;}

    bool IsPagingEnabled{get;}

    IQueryable<T> ApplyCriteria(IQueryable<T> query);

}

public interface ISpecification<T,Tresult> : ISpecification<T> where T : class
{
    Expression<Func<T, Tresult>>? Select { get; }
}
