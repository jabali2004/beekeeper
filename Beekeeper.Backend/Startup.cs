using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Transactions;
using AutoMapper;
using Beekeeper.Backend.Models;
using Beekeeper.Backend.Utils;
using Hangfire;
using Hangfire.MySql;
using HotChocolate.AspNetCore;
using HotChocolate.AspNetCore.Playground;
using HotChocolate.Types.Pagination;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace Beekeeper.Backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            StaticConfig = configuration;
        }

        private IConfiguration Configuration { get; }
        public static IConfiguration StaticConfig { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var dbConnectionString = Configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<BeekeeperContext>(options =>
                    options.UseMySql(dbConnectionString, ServerVersion.AutoDetect(dbConnectionString)),
                ServiceLifetime.Transient);

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Beekeeper.Backend", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header
                        },
                        new List<string>()
                    }
                });
            });

            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
                {
                    // TODO: Add secure password requirements
                    options.Password.RequiredLength = 8;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireDigit = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequiredUniqueChars = 0;
                    options.Password.RequireNonAlphanumeric = false;
                }).AddEntityFrameworkStores<BeekeeperContext>()
                .AddDefaultTokenProviders();

            // Adding Authentication  
            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                })

                // Adding Jwt Bearer  
                .AddJwtBearer(options =>
                {
                    options.SaveToken = true;
                    options.RequireHttpsMetadata = false;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidAudience = Configuration["JWT:ValidAudience"],
                        ValidIssuer = Configuration["JWT:ValidIssuer"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:Secret"]))
                    };
                });

            // Add Hangfire services.
            var mysqlStorageOptions = new MySqlStorageOptions
            {
                TransactionIsolationLevel = IsolationLevel.ReadCommitted,
                QueuePollInterval = TimeSpan.FromSeconds(15),
                JobExpirationCheckInterval = TimeSpan.FromHours(1),
                CountersAggregateInterval = TimeSpan.FromMinutes(5),
                PrepareSchemaIfNecessary = true,
                DashboardJobListLimit = 50000,
                TransactionTimeout = TimeSpan.FromMinutes(1),
                TablesPrefix = "Hangfire"
            };

            services.AddHangfire(configuration =>
            {
                configuration.UseStorage(
                    new MySqlStorage(
                        dbConnectionString,
                        mysqlStorageOptions
                    )
                );
            });

            // Add the processing server as IHostedService
            services.AddHangfireServer();

            services
                .AddGraphQLServer()
                .AddQueryType<Query>()
                .AddFiltering()
                .AddSorting()
                .SetPagingOptions(new PagingOptions
                {
                    IncludeTotalCount = true
                })
                // Enable tracing with HTTP Header => { "GraphQL-Tracing":"1" } | Playground JSON
                .AddApolloTracing();

            services.AddHttpContextAccessor();

            services.AddControllers();

            // Auto Mapper Configurations
            var mapperConfig = new MapperConfiguration(mc => { mc.AddProfile(new MappingProfile()); });

            var mapper = mapperConfig.CreateMapper();
            services.AddSingleton(mapper);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IBackgroundJobClient backgroundJobs)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Beekeeper.Backend v1"));
                app.UseHangfireDashboard();

                // Use GraphQL Playground
                app.UsePlayground(
                    new PlaygroundOptions { Path = "/playground", QueryPath = "/graphql" });
            }

            if (env.IsProduction())
            {
                app.Use(async (context, next) =>
                {
                    await next();
                    if (context.Request.Path.Value != null && context.Response.StatusCode == 404 &&
                        !Path.HasExtension(context.Request.Path.Value) &&
                        !context.Request.Path.Value.StartsWith("/api/") &&
                        !context.Request.Path.Value.StartsWith("/graphql/"))
                    {
                        context.Request.Path = "/index.html";
                        await next();
                    }
                });

                app.UseDefaultFiles(new DefaultFilesOptions { DefaultFileNames = new List<string> { "index.html" } });
                app.UseFileServer(new FileServerOptions
                {
                    FileProvider = new PhysicalFileProvider(
                        Path.Combine(env.ContentRootPath, "frontend"))
                });
            }

            // app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapGraphQL();
            });

            if (env.IsProduction())
                InitializeDatabase(app);
        }

        private void InitializeDatabase(IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.GetService<IServiceScopeFactory>()?.CreateScope();
            if (scope != null) scope.ServiceProvider.GetRequiredService<BeekeeperContext>().Database.Migrate();
        }
    }
}