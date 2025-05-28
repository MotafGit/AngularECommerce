using System;
using Core.Entities;
using Core.Interfaces;
using Core.Specification;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TypesController (IGenericRepository<Types> repo) : BaseApiController
{


    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Types>>> GetTypes(){
    var spec = new TypesSpecification();
    return Ok(await repo.ListAsync(spec));
    }

}
