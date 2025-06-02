using System;
using System.IO.Pipelines;
using System.Linq.Expressions;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Specification;

public class BaseSpecification<T>(Expression<Func<T,bool>>? criteria, List<Expression<Func<T, object>>> includes ) : ISpecification<T> where T : class
{

    // private Func<Product, bool> value;



    public Expression<Func<T,bool>>? Criteria => criteria;

     public List<Expression<Func<T, object>>>? Includes  => includes ?? new List<Expression<Func<T, object>>>();




     public Expression<Func<T,object>>? OrderBy {get; private set;}


     public Expression<Func<T,object>>? OrderByDescending {get; private set;}

    public bool isDistinct {get;private set;}

    public int Take  {get; private set;}

    public int Skip  {get; private set;}

    public bool IsPagingEnabled  {get; private set;}



#pragma warning disable CS0693 // Type parameter has the same name as the type parameter from outer type
    public Expression<Func<T, object>> GenericExpression<T>( string navigation)
#pragma warning restore CS0693 // Type parameter has the same name as the type parameter from outer type
    {
        var parameter = Expression.Parameter(typeof(T), "x");
        var property = Expression.PropertyOrField(parameter, navigation);
        var conversion = Expression.Convert(property, typeof(object));
        return Expression.Lambda<Func<T, object>>(property, parameter);
       // return Expression.Lambda<Func<T, object>>(property, parameter);
    }

    public IQueryable<T> ApplyCriteria(IQueryable<T> query)
    {
        if (Criteria != null)
        {
         query = query.Where(Criteria);
        }
        if (Includes != null && Includes.Any())
        {
            foreach (var include in Includes)
            {
                query = query.Include(include);
            }
        }
        return query;
    }

    protected void AddOrderBy(Expression<Func<T, object>> orderByExpression){

        OrderBy = orderByExpression;
     }

    protected void AddOrderByDescending(Expression<Func<T, object>> orderByDescExpression){

    OrderByDescending = orderByDescExpression;
    }

     protected void ApplyDistinct()
     {
         isDistinct = true;
     }

    protected void ApplyPaging (int skip, int take)
    {
        Skip = skip;
        Take = take;
        IsPagingEnabled = true;
    }

    protected void AddInclude(Expression<Func<T, object>> includeExpression)
    {
#pragma warning disable CS8602 // Dereference of a possibly null reference.
        Includes.Add(includeExpression);
#pragma warning restore CS8602 // Dereference of a possibly null reference.
    }



}


public class BaseSpecification<T,Tresult>(Expression <Func<T,bool>> criteria, List<Expression<Func<T, object>>> includes ) : BaseSpecification <T>(criteria, includes ?? new List<Expression<Func<T, object>>>()), ISpecification<T, Tresult> where T : class
{


   protected BaseSpecification() : this(null!, new List<Expression<Func<T, object>>>()){}



    public Expression<Func<T,Tresult>>? Select {get; private set;}

    public Expression<Func<T,object>>? Include {get; private set;}


    public List<Expression<Func<T, object>>> Includes { get; private set; } = new List<Expression<Func<T, object>>>();

   protected void AddSelect(Expression<Func<T,Tresult>> selectExpression){
      Select = selectExpression;
   }
   
    protected void AddInclude(Expression<Func<T, object>> includeExpression)
    {
        Include = includeExpression;
        Includes.Add(includeExpression);
    }

}