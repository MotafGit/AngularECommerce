using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ReviewController (IReviewService service) : ControllerBase
{
    [Authorize]
    [HttpPost("{email}")]
    public async Task<ActionResult<Reviews>> SaveReview (string email, [FromBody] Reviews request){
        
        var savedReview = await service.CreateReview(email, request);
        if (savedReview == null){
            return BadRequest();
        }

        return Ok(savedReview);
    }

    [Authorize]
    [HttpGet("check/{email}/{productId}")]
    public async Task<ActionResult<bool>> SaveReview (string email, int productId ){
        
        var aux = await service.CheckIfUserHasReview(email, productId);

        if (aux == null) return BadRequest("user not found");
       
       if (aux == true){
        return Ok(true);
       }

        return Ok(false);
    }

}



