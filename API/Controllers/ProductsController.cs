
using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specification;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Webp;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController (IGenericRepository<Product> repo, IHttpClientFactory httpClientFactory, StoreContext context) : BaseApiController
{


    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts(
        [FromQuery]ProductSpecParams specParams)
    {
        var spec = new ProductSpecification(specParams);

        // var products = await repo.ListAsync(spec);

        // var count = await repo.CounterAsync(spec);

        // var pagination = new Pagination<Product>(specParams.PageIndex, specParams.PageSize, count, products);
        
        // return Ok( await repo.GetProducts(brand, type, sort));
        return await CreatePagedResult(repo, spec, specParams.PageIndex, specParams.PageSize);
    }

    // [HttpGet("testa")]
    // public async Task<ActionResult<Product>> GetProducts123( int id){
    //     var result = context.Products
    //         //.Where(p => new[] { 17, 27 }.Contains(p.TypeId))
    //         .Where(p => p.TypeNavigation.TypeName.Contains("Jeans"))
    //         // .Include(p => p.Type1) // assuming navigation property exists
    //         // .ThenInclude(p => p.TypesType)
    //         .ToList();
    //         return   Ok(result);
    // }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct( int id){
        var product = await repo.GetByIdAsyncWithIncludes( id,[ x => x.BrandNavigation, x => x.TypeNavigation]);

        // var product = await repo.GetByIdAsync(id);
        
        if (product == null) return NotFound();
        return product;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct( Product product){
       var aux = new ProductSpecParams();
       var spec = new ProductSpecification(aux);

       product.Id = null;

        // var spec1 = new ProductSpecification(product1);
         var count = await repo.GetHighestId(spec);
         count++;

        if (product.PictureUrl.Contains("https") && (product.PictureUrl.Contains(".png") || product.PictureUrl.Contains(".jpeg") || product.PictureUrl.Contains(".jpg") || product.PictureUrl.Contains(".webp") ))
        {
        var client = httpClientFactory.CreateClient();

            // Download the image
        var response = await client.GetAsync(product.PictureUrl);
        response.EnsureSuccessStatusCode();

        var imageBytes = await response.Content.ReadAsByteArrayAsync();



        var fileName = product.Name + count + ".webp"; // fallback filename

        await CropAndSaveImg(fileName, imageBytes, 1);

        product.PictureUrl = "/images/products/" + fileName;

        }

        repo.Add(product);
        if (await repo.SaveAllAsync())
        {
             await context.Entry(product).Reference(p => p.TypeNavigation).LoadAsync();
             await context.Entry(product).Reference(p => p.BrandNavigation).LoadAsync();
            return CreatedAtAction("GetProduct", new{id = product.Id}, product);
        }
        return BadRequest("Problem creating product");
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, [FromBody] UpdateProductRequest request){


        
        if (request.Product.Id != id  || !ProductExists(id)){
            return BadRequest ("Cannot update this product");
        }


        if (request.Product.PictureUrl.Contains("https") && (request.Product.PictureUrl.Contains(".png") || request.Product.PictureUrl.Contains(".jpeg") || request.Product.PictureUrl.Contains(".jpg") || request.Product.PictureUrl.Contains(".webp")))
        {
             var client = httpClientFactory.CreateClient();

            var response = await client.GetAsync(request.Product.PictureUrl);
            response.EnsureSuccessStatusCode();
            var imageBytes = await response.Content.ReadAsByteArrayAsync();

            
            await CropAndSaveImg(request.PreviousUrl, imageBytes, 2);
            request.Product.PictureUrl = request.PreviousUrl;
        }
        // else{
        //     return BadRequest();
        // } 

       
        repo.Update(request.Product);

        if (await repo.SaveAllAsync())
        {
              await context.Entry(request.Product).Reference(p => p.TypeNavigation).LoadAsync();
              await context.Entry(request.Product).Reference(p => p.BrandNavigation).LoadAsync();

            return Ok(request.Product);
        }


        return BadRequest("Problem updating product");
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<Product>> DeleteProduct( int id){
        var product = await repo.GetByIdAsync(id);

        if (product == null) return NotFound();

        repo.Remove(product);

         if (await repo.SaveAllAsync())
        {
            return NoContent();
        }

        return BadRequest("Problem deleting product");
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands(){
        var spec = new BrandListSpecification();
        return Ok(await repo.ListAsync(spec));
    }

    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes(){
         var spec = new TypeListSpecification();
        return Ok(await repo.ListAsync(spec));
    }

    private bool ProductExists(int id){
        return repo.Exists(id);
    }


     async Task CropAndSaveImg(string fileName, byte[]? imageBytes, int flag)
    {
        // int flag = 1 create, int flag = 2 update
            var parentDirectory = Directory.GetParent(Directory.GetCurrentDirectory());

            var currentDirectory = Directory.GetCurrentDirectory();

            var folderPath = "" ;   
            var filePath = "";
            var filePath2 = "";

            if ( flag == 1)
            {
                if (parentDirectory != null)
                {
                    folderPath = Path.Combine(parentDirectory.FullName, "client/public/images/products");
                }

            var wwwrootPath = Path.Combine(currentDirectory, "wwwroot/images/products");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
               //  filePath = Path.Combine(folderPath, fileName);
                 filePath2 = Path.Combine(wwwrootPath, fileName);
            }
            else
            {
                fileName = fileName.Substring(1);
                if (parentDirectory != null)
                {
                    folderPath = Path.Combine(parentDirectory.FullName, "client/public");
                }

            var wwwrootPath = Path.Combine(currentDirectory, "wwwroot");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                // filePath = Path.Combine(folderPath, fileName);
                 filePath2 = Path.Combine(wwwrootPath, fileName);

            }
            



           // await System.IO.File.WriteAllBytesAsync(filePath, imageBytes);

           using (var image = Image.Load<Rgba32>(imageBytes))
            {
                int size = Math.Min(image.Width, image.Height); // size of the square

                // Calculate crop position to center the crop
                int x = (image.Width - size) / 2;
                int y = (image.Height - size) / 2;

                // Crop the image to a square
                image.Mutate(ctx => ctx.Crop(new Rectangle(x, y, size, size)));

                image.Mutate(ctx => ctx.Resize(1024,1024));


                // int maxDimension = 1024; // or your preferred size
                // if (image.Width > maxDimension || image.Height > maxDimension)
                // {
                //     image.Mutate(ctx => ctx.Resize(new ResizeOptions
                //     {
                //         Mode = ResizeMode.Max,
                //         Size = new Size(maxDimension, maxDimension)
                //     }));
                // }

                // Save the modified image to a memory stream
                using (var ms = new MemoryStream())
                {
                // var pngEncoder = new PngEncoder()
                // {
                //     CompressionLevel = PngCompressionLevel.Level9
                // };

                // await image.SaveAsPngAsync(ms);
                var webpEncoder = new WebpEncoder()
                {
                    Quality = 75 // You can adjust quality as needed (0-100)
                };
        await image.SaveAsWebpAsync(ms, webpEncoder);
                var squaredImageBytes = ms.ToArray();

                // Write the squared image bytes to disk
              //  await System.IO.File.WriteAllBytesAsync(filePath, squaredImageBytes);
                await System.IO.File.WriteAllBytesAsync(filePath2, squaredImageBytes);

                }
            }
    }


    public class UpdateProductRequest
{
    public required Product Product { get; set; }
    public required string PreviousUrl { get; set; }
}

}
