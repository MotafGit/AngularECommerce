using System;
using Core.Entities;
using Core.Interfaces;
using Core.Specification;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandsController (IGenericRepository<Brands> repo) : BaseApiController
{


    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Brands>>> GetBrands(){
    var spec = new BrandsSpecification();
    return Ok(await repo.ListAsync(spec));
    }

}
