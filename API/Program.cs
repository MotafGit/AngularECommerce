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
using Microsoft.Extensions.FileProviders;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// builder.Services.AddDbContext<StoreContext>(opt =>
// {
//     opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
// });

builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(5),
                errorNumbersToAdd: null);
        });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// builder.Services.AddOpenApi();

builder.Services.AddScoped<IProductRepository,ProductRepository>();
builder.Services.AddScoped<IPaymentService,PaymentService>();
builder.Services.AddScoped<IOrdersService,OrdersService>();
builder.Services.AddScoped<IPaymentRepository,PaymentRepository>();
builder.Services.AddScoped<IUsersService,UsersService>();
builder.Services.AddScoped<IUsersRepository,UsersRepository>();
builder.Services.AddScoped<IReviewService,ReviewService>();



builder.Services.AddHttpClient();
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
 app.UseDefaultFiles();
 app.UseStaticFiles();
// var abc = Directory.GetParent(Directory.GetCurrentDirectory());
// if(abc != null)
// {
// app.UseStaticFiles(new StaticFileOptions
// {
    
//     FileProvider = new PhysicalFileProvider(
        
//         Path.Combine(abc.FullName, "client", "public", "images")),
//     RequestPath = "/images",
//         OnPrepareResponse = ctx =>
//     {
//         ctx.Context.Response.Headers.Append("Cache-Control", "no-cache, no-store, must-revalidate");
//         ctx.Context.Response.Headers.Append("Pragma", "no-cache");
//         ctx.Context.Response.Headers.Append("Expires", "0");
//     }
// });
// }

// app.UseStaticFiles(); // Serves files from wwwroot by default
// // Or, if serving from a custom directory:
// var abc = Directory.GetParent(Directory.GetCurrentDirectory());
// if (abc != null)
// {
// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(
//         Path.Combine(abc.FullName, "client", "public")
//     ),
//     RequestPath = "/"
// });
// }


app.UseCors( x =>  x.AllowAnyHeader().AllowAnyMethod().AllowCredentials()
    .WithOrigins("http://localhost:4200", "https://localhost:4200"));   

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
// }

// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.MapGroup("api").MapIdentityApi<AppUser>(); 
app.MapFallbackToController("Index", "Fallback");

// try{
//     using var scope = app.Services.CreateScope();
//     var services = scope.ServiceProvider;
//     var context = services.GetRequiredService<StoreContext>();
//      await context.Database.MigrateAsync();
//     await StoreContextSeed.SeedAsync(context);
// }
// catch(Exception ex){
//     Console.WriteLine(ex);
//     throw;
// }

try
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<StoreContext>();
    await context.Database.MigrateAsync();
    // await StoreContextSeed.SeedAsync(context);
    // var strategy = context.Database.CreateExecutionStrategy();

    // await strategy.ExecuteAsync(async () =>
    // {
    //     await context.Database.MigrateAsync();
    //    // await StoreContextSeed.SeedAsync(context);
    // });
}
catch (Exception ex)
{
    Console.WriteLine($"Migration failed: {ex.Message}");
    throw;
}

app.Run();
