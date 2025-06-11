using System;
using Core.Entities;
using Core.Interfaces;
using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Core.Specification;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class ReviewService (IGenericRepository<Reviews> reviewsRepo, IGenericRepository<Product> productRepo, UserManager<AppUser> userManager, StoreContext context) : IReviewService
{
    public async Task<bool?> CheckIfUserHasReview(string email, int productId)
    {
         var user = await userManager.FindByEmailAsync(email);
        if (user == null) return false;
        var check = context.Reviews
                    .Where(x => x.UserId == user.Id && x.ProductId ==productId).FirstOrDefault();
        if (check == null) return false;

        return true;
    }

    public async Task<Reviews?> CreateReview(string email, Reviews review)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null) return null;
        review.UserId = user.Id;
        DateTime today = DateTime.Now;
        int year = today.Year;
        int month = today.Month;
        int day = today.Day;
        review.ReviewData = today;

        reviewsRepo.Add(review);

        // var spec = new BaseSpecification<Reviews>(review => review.ProductId == review.ProductId, null);
        // var reviews = await reviewsRepo.ListAsync(spec);

        // var spec = new BaseSpecification<Reviews>(review => review.ProductId == review.ProductId, null);
        // var reviews = await reviewsRepo.ListAsync(spec);




        if (await reviewsRepo.SaveAllAsync())
        {

            var averageScore = await context.Reviews
            .Where( r => r.ProductId == review.ProductId)
            .Select(r => r.Score)
            .AverageAsync();

            var roundedAverage = Math.Round((decimal)averageScore, 1);

           var product = await productRepo.GetByIdAsync(review.ProductId);
           product!.AvgScore = roundedAverage;

           productRepo.Update(product);


            if (await productRepo.SaveAllAsync())
            {
                return review;
            }

        
            
        }
        return null;
    }
}

