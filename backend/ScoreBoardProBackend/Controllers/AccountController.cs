using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ScoreBoardProBackend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ScoreBoardProBackend.Data;

namespace ScoreBoardProBackend.Controllers;


[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _dbContext;

    public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, 
        IConfiguration configuration, ApplicationDbContext dbContext)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _dbContext = dbContext;
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = new ApplicationUser() { UserName = model.Email, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            var token = GenerateJwtToken(user);
            await _signInManager.SignInAsync(user, isPersistent: false);
            return Ok(new { message = "User registered successfully", token = token });
        }

        return BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
            return Unauthorized(new { message = "Invalid login attempt" });

        var result =
            await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe,
                lockoutOnFailure: false);

        if (result.Succeeded)
        {
            var token = GenerateJwtToken(user);
            return Ok(new { message = "Login successful", token = token});
        }
            

        return Unauthorized(new { message = "Invalid login attempt" });
    }
    
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok(new { message = "Logout successful" });
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("user-info")]
    public async Task<IActionResult> GetUserInfo()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "User not authenticated" });

        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(new
        {
            userId = user.Id,
            email = user.Email,
            username = user.UserName,
            roles = await _userManager.GetRolesAsync(user)
        });
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("favorite-players")]
    public async Task<IActionResult> GetFavoritePlayers()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "User not authenticated" });

        var favoritePlayers = await _dbContext.FavPlayers
            .Where(fp => fp.UserId == userId)
            .Select(fp => new { fp.PlayerId, fp.DateAdded })
            .ToListAsync();
        
        return Ok(favoritePlayers);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var users = await _userManager.Users
            .Where(user => user.Id != currentUserId) // Filtrujemy użytkowników
            .Select(user => new 
            {
                user.Id,
                user.UserName,
                user.Email,
            })
            .ToListAsync();

        return Ok(users);
    }
    
    [Authorize(Roles = "Admin")]
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound(new { message = "User not found" });

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { message = "User deleted successfully" });
    }
    
    

    [Authorize(Roles = "Admin")]
    [HttpPost("assign-role")]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleModel model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
            return NotFound(new { message = "User not found" });

        var result = await _userManager.AddToRoleAsync(user, model.Role);
        if(result.Succeeded)
            return Ok(new { message = $"Role {model.Role} assigned to user {model.Email} successfully." });

        return BadRequest(result.Errors);
    }

  

    private string GenerateJwtToken(ApplicationUser user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email)
        };
        
        var roles = _userManager.GetRolesAsync(user).Result;
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: credentials
        );

        var tokenHandler = new JwtSecurityTokenHandler();
        return tokenHandler.WriteToken(token);
    }
}