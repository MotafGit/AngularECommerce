using System;
using Core.Entities;

namespace Core.Specification;

public class ProductSpecParams
{
    private const int MaxPageSize = 50;

    public int PageIndex {get;set;} = 1;

    private int _pageSize = 6;
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
    }
    
    private List<string> _brands = [];
    public List<string>  Brands
    {
        get => _brands;
        set { 
            _brands = value.SelectMany(x => x.Split(',',
                StringSplitOptions.RemoveEmptyEntries)).ToList();
        }
    }


    private List<string> _Typess = [];
    public List<string>  Typess
    {
        get => _Typess;
        set
    {
         _Typess = value.SelectMany(x => x.Split(',',
        StringSplitOptions.RemoveEmptyEntries)).ToList();

    }
    }


    private List<string> _Includes = [];
    public List<string>  Includes
    {
        get => _Includes;
        set
    {
         _Includes = value.SelectMany(x => x.Split(',',
        StringSplitOptions.RemoveEmptyEntries)).ToList();

    }
    }

//      private List<int> _brands = [];

// public List<int> Brands
// {
//     get => _brands;
//     set
//     {
//         _brands = value
//             .SelectMany(x => x.Split(',', StringSplitOptions.RemoveEmptyEntries))
//             .Select(int.Parse)
//             .ToList();
//     }
// }
  







    private List<string> _types = [];
    public List<string>  Types
    {
        get => _types;
        set { 
            _types = value.SelectMany(x => x.Split(',',
                StringSplitOptions.RemoveEmptyEntries)).ToList();
        }
    }


    public string? Sort {get;set;}

    private string? _search;
    public string Search
    {
        get  => _search ?? "";
        set  => _search = value.ToLower();
    }
    
    
}
