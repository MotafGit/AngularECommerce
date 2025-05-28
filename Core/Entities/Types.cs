using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

public class Types : BaseEntity
{
     public required string TypeName {get;set;}

    [ForeignKey("TypesTypeNavigation")]
    public int TypesTypeId { get; set; }

    public virtual TypesType? TypesTypeNavigation { get; set; }


}

 