using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandController(IGenericRepository<Brands> _brandRepository)  : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Brands>>> GetBrands()
    {
        var brands = await _brandRepository.ListAllAsync();
        return Ok(brands);
    }

}
