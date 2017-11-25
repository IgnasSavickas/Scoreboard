using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
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
                    policy.WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            //services.AddMvc();
            services.AddMvcCore()
                .AddApiExplorer()
                .AddAuthorization()
                .AddJsonFormatters();

            services.AddAuthentication("Bearer")
                .AddIdentityServerAuthentication(options =>
                {
                    options.Authority = "http://localhost:5000";
                    options.RequireHttpsMetadata = false;

                    options.ApiName = "scoreboardapi";
                });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("scoreboard_server", new Info());
                c.AddSecurityDefinition("Bearer", new ApiKeyScheme
                {
                    In = "header", Description = "Please insert JWT with Bearer into field", Name = "Authorization", Type = "apiKey"
                });
            });

            services.AddScoped<ITeamsService, TeamsService>();
            services.AddScoped<ITeamsRepository, TeamsRepository>();
            services.AddScoped<IPlayersService, PlayersService>();
            services.AddScoped<IPlayersRepository, PlayersRepository>();
            services.AddScoped<IGamesService, GamesService>();
            services.AddScoped<IGamesRepository, GamesRepository>();
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlite("Filename=../database.db"));
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

            app.UseMvc();

            const string swaggerUrl = "/swagger/scoreboard_server/swagger.json";
            app.UseSwagger()
                .UseSwaggerUI(c =>
                {
                    c.DocExpansion("none");
                    c.SwaggerEndpoint(swaggerUrl, "Scoreboard Server");
                });
        }
    }

}
