using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ScoreBoardProBackend.Data;
using ScoreBoardProBackend.Models;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "Bearer";
    options.DefaultChallengeScheme = "Bearer";
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]))
    };
});
    

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    await SeedRolesAndAdminUser(roleManager, userManager);
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseRouting();

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();


async Task SeedRolesAndAdminUser(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
{
    string[] roleNames = { "Admin", "User" };

    foreach (var roleName in roleNames)
    {
        if (!await roleManager.RoleExistsAsync(roleName))
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }

    var adminEmail = "admin@scoreboardpro.com";
    var adminUser = await userManager.FindByEmailAsync(adminEmail);

    if (adminUser == null)
    {
        var newAdmin = new ApplicationUser { UserName = adminEmail, Email = adminEmail };
        var adminPassword = "qw12QW!@";

        var createAdminResult = await userManager.CreateAsync(newAdmin, adminPassword);
        
        if (createAdminResult.Succeeded)
        {
            await userManager.AddToRoleAsync(newAdmin, "Admin");
        }
    }

for (int i = 1; i <= 5; i++)
    {
        var userEmail = $"user{i}@scoreboard.com";
        var user = await userManager.FindByEmailAsync(userEmail);

        if (user == null)
        {
            var newUser = new ApplicationUser { UserName = userEmail, Email = userEmail };
            var userPassword = "qw12QW!@";

            var createUserResult = await userManager.CreateAsync(newUser, userPassword);

            if (createUserResult.Succeeded)
            {
                await userManager.AddToRoleAsync(newUser, "User");
            }
        }
    }
}

