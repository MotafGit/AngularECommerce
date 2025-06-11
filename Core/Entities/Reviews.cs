using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

public class Reviews : BaseEntity
{

    public required string Comment {get;set;}

    public required int Score {get;set;}

    public required string Title {get;set;}

    public DateTime ReviewData {get;set;}



    [ForeignKey("Product")]
    public required int ProductId {get;set;}

    [ForeignKey("UserNavigation")]
    public string? UserId {get;set;}


    public virtual AppUser? UserNavigation { get; set; }

}
