using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specification;

// public class UserSpecification : BaseSpecification<AppUser, AppUser>
// {
//      public UserSpecification()
//     {
//         AddSelect(x => x);
//        // ApplyDistinct();
//     }
// }


public class UserSpecification : BaseSpecification<AppUser>
{
    public UserSpecification( BaseSpecParams specParams ) : base(x =>
        string.IsNullOrEmpty(specParams.Search) || x.FirstName.ToLower().Contains(specParams.Search),
#pragma warning restore CS8602 // Dereference of a possibly null reference.
        new List<Expression<Func<AppUser, object>>>() 
    )
    {
        if(specParams.Includes.Count > 0){ 
            foreach(var str in specParams.Includes)
            {
                var a = GenericExpression<AppUser>(str);
                AddInclude(a);
            }
        }
        

        ApplyPaging(specParams.PageSize * (specParams.PageIndex -1 ), specParams.PageSize);
        // switch (specParams.Sort)
        // {
        //     case "priceAsc":
        //          AddOrderBy(x => x.Price);
        //         break;
        //     case "priceDesc":
        //         AddOrderByDescending(x => x.Price);
        //         break;
        //     case "orderByIdDesc":
        //         AddOrderByDescending(x => x.Id);
        //         break;
        //     default:
        //         AddOrderBy(x => x.Name);
        //         break;
        // }
    }
}
