using System;
using System.Security.Claims;
using API.DTO;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
 [HttpGet("unauthorized")]
    public IActionResult GetUnauthorized()
    {
        return  Unauthorized();
    }

     [HttpGet("badrequest")]
    public IActionResult GetBadRequest()
    {
        return  BadRequest("Not a good request");
    }

     [HttpGet("notfound")]
    public IActionResult GetNotFound()
    {
        return  NotFound();
    }

     [HttpGet("internalerror")]
    public IActionResult GetInternalError()
    {
        throw new Exception("test");
    }

     [HttpPost("validationerror")]
    public IActionResult GetValidationError(ProductDto product)
    {
        return  Ok();
    }

    [Authorize]
    [HttpGet("abc")]
    public IActionResult abc(){
        var name = User.FindFirst(ClaimTypes.Name)?.Value;
        var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        return Ok("hello " + name + " with id " + id);
    }
}
