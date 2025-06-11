using System;
using Core.Entities;

namespace Core.Interfaces;

public interface IReviewService
{
     Task<Reviews?> CreateReview(string email, Reviews review);

     Task<bool?> CheckIfUserHasReview(string email, int productId);

}
