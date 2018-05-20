using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ScoreboardServer.Database;
using ScoreboardServer.Repositories;
using ScoreboardServer.Services;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace ScoreboardServer
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("default", policy =>
                {
                    policy.WithOrigins("http://localhost:4200", "http://localhost")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            services.AddMvcCore()
                .AddApiExplorer()
                .AddAuthorization()
                .AddJsonFormatters()
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                });

            services.AddAuthentication("Bearer")
                .AddIdentityServerAuthentication(options =>
                {
                    options.Authority = "http://localhost:5000";
                    options.RequireHttpsMetadata = false;

                    options.ApiName = "scoreboardapi";
                });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Scoreboard Server API", Version = "v1" });
                c.AddSecurityDefinition("oauth2", new OAuth2Scheme
                {
                    Type = "oauth2",
                    Flow = "implicit",
                    AuthorizationUrl = "http://localhost:5000/connect/authorize",
                    TokenUrl = "http://localhost:5000/connect/token",
                    Scopes = new Dictionary<string, string>
                    {
                        { "scoreboardapi", "Scoreboard API" }
                    }
                });
                c.OperationFilter<AuthorizeCheckOperationFilter>();
            });

            services.AddScoped<ITeamsService, TeamsService>();
            services.AddScoped<ITeamsRepository, TeamsRepository>();
            services.AddScoped<IPlayersService, PlayersService>();
            services.AddScoped<IPlayersRepository, PlayersRepository>();
            services.AddScoped<IGamesService, GamesService>();
            services.AddScoped<IGamesRepository, GamesRepository>();
            services.AddScoped<IStatsService, StatsService>();
            services.AddScoped<IStatsRepository, StatsRepository>();
            services.AddScoped<IFileUploadService, FileUploadService>();
            services.AddEntityFrameworkSqlServer().AddDbContext<ApplicationDbContext>(options => options.UseSqlite("Filename=../../database.db"));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseAuthentication();

            app.UseCors("default");

            var imagesDirectoryPath = Path.Combine(Directory.GetCurrentDirectory(), "images");
            Directory.CreateDirectory(imagesDirectoryPath);

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    imagesDirectoryPath),
                RequestPath = new PathString("/images")
            });

            app.UseMvc();

            const string swaggerUrl = "/swagger/v1/swagger.json";
            app.UseSwagger()
                .UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint(swaggerUrl, "Scoreboard Server API V1");
                    c.OAuthClientId("swaggerui");
                });
        }
    }

}
