using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using SqlInjectionDemo.Data;

namespace SqlInjectionDemo
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // ConfigureServices method is used to add services to the DI container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add services to the container.

            // Add Entity Framework Core
            services.AddDbContext<OrdersContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            // Add CORS policy
            services.AddCors(options =>
            {
                options.AddPolicy(name: "AllowSpecificOrigin",
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:3000") // URL of the React frontend
                               .AllowAnyHeader()
                               .AllowAnyMethod();
                    });
            });

            // Add Controllers
            services.AddControllers();

            // Register the Swagger generator
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "SqlInjectionDemo API", Version = "v1" });
            });
        }

        // Configure method is used to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, OrdersContext context)
        {
            DatabaseInitializer.Initialize(context);
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SqlInjectionDemo API v1"));

            // app.UseHttpsRedirection();
            app.UseRouting();

            // Use CORS policy
            app.UseCors("AllowSpecificOrigin");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
