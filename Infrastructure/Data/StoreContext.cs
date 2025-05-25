using System;
using Core.Entities;
using Infrastructure.Config;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<AppUser>(options)
{
    public DbSet<Product> Products { get; set; }

    public DbSet<UserAddress> Addresses { get; set; }

    public DbSet<Delivery> Delivery { get; set; }

    public DbSet<Payment> Payment { get; set; }


    public DbSet<PaymentType> PaymentTypes { get; set; }




    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

         modelBuilder.Entity<CartItem>()
            .Property(c => c.Price)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Payment>()
            .Property(p => p.TotalPrice)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<ShoppingCart>()
            .Property(s => s.Total)
            .HasColumnType("decimal(18,2)");

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ProductConfiguration).Assembly);
    }

}
