using Core.Interfaces;
using Infrastructure;
using Infrastructure.Data;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Diagnostics;
using API.Middleware;
using StackExchange.Redis;
using Microsoft.Extensions.Options;
using Infrastructure.Services;
using Core.Entities;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// builder.Services.AddOpenApi();

builder.Services.AddScoped<IProductRepository,ProductRepository>();
builder.Services.AddScoped<IPaymentService,PaymentService>();
builder.Services.AddScoped<IPaymentRepository,PaymentRepository>();

builder.Services.AddScoped(typeof(IGenericRepository<>),typeof(GenericRepository<>));
builder.Services.AddCors();
builder.Services.AddSingleton<IConnectionMultiplexer>(config => {
    var connString = builder.Configuration.GetConnectionString("Redis");
    if (connString == null) throw new Exception("Couldnt connect to redis");
    var configuration = ConfigurationOptions.Parse(connString, true);
    return ConnectionMultiplexer.Connect(configuration);
});
builder.Services.AddScoped<ICartService,CartService>();
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<StoreContext>();

var app = builder.Build();


// app.UseExceptionHandler("/Error");
 app.UseMiddleware<ExceptionMiddleware>();


app.UseCors( x =>  x.AllowAnyHeader().AllowAnyMethod().AllowCredentials()
    .WithOrigins("http://localhost:4200", "https://localhost:4200"));   

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
// }

// app.UseHttpsRedirection();

// app.UseAuthorization();


app.MapControllers();

app.MapGroup("api").MapIdentityApi<AppUser>(); 

try{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<StoreContext>();
     await context.Database.MigrateAsync();
    await StoreContextSeed.SeedAsync(context);
}
catch(Exception ex){
    Console.WriteLine(ex);
    throw;
}

app.Run();
