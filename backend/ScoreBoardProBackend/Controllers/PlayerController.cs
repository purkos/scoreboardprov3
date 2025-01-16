using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScoreBoardProBackend.Data;
using ScoreBoardProBackend.Models;
using Npgsql;

namespace ScoreBoardProBackend.Controllers;

[Route("api/[controller]")]
public class PlayerController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public PlayerController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

	[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost("add-to-favorites/")]
	public async Task<IActionResult> AddToFavorites([FromBody] AddToFavoritesModel model)
	{
    	if (model == null || string.IsNullOrEmpty(model.PlayerId))
        	return BadRequest("Invalid player id");

    	var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    	if (string.IsNullOrEmpty(userId))
        	return Unauthorized("User not authenticated");

    	await _dbContext.Database.ExecuteSqlRawAsync("CALL add_to_favorites(@userId, @playerId)", 
        	new NpgsqlParameter("@userId", userId), 
        	new NpgsqlParameter("@playerId", model.PlayerId));

    	return Ok(new { message = "Player added to favorites successfully." });
	}

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("is-favorite/{playerId}")]
    public async Task<IActionResult> IsFavorite(string playerId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var isFavorite = await _dbContext.FavPlayers.AnyAsync(f => f.UserId == userId && f.PlayerId == playerId);

        return Ok(new { isFavorite });
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost("rate")]
    public async Task<IActionResult> AddOrUpdateRating([FromBody] PlayerRatingDto ratingDto)
    {
        var messageHelper = "added";
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "User not authenticated" });

        var existingRating = await _dbContext.PlayerRatings.FirstOrDefaultAsync(pr => pr.UserId == userId && pr
            .PlayerId == ratingDto.PlayerId);

        if (existingRating != null)
        {
            messageHelper = "updated";
            existingRating.Rating = ratingDto.Rating;
            existingRating.DateAdded = DateTime.UtcNow;
            _dbContext.PlayerRatings.Update(existingRating);
        }
        else
        {
            messageHelper = "added";
            var newRating = new PlayerRating
            {
                UserId = userId,
                PlayerId = ratingDto.PlayerId,
                Rating = ratingDto.Rating,
                DateAdded = DateTime.UtcNow
            };
            _dbContext.PlayerRatings.Add(newRating);
        }

        await _dbContext.SaveChangesAsync();
        return Ok(new { message = "Rating " + messageHelper + " successfully" });
    }

    [HttpDelete("remove-from-favorites/{playerId}")]
    public async Task<IActionResult> RemoveFromFavorites(string playerId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

        var favPlayer =
            await _dbContext.FavPlayers.FirstOrDefaultAsync(f => f.UserId == userId && f.PlayerId == playerId);

        if (favPlayer == null)
            return NotFound("Player not found in your favorites");

        _dbContext.FavPlayers.Remove(favPlayer);
        await _dbContext.SaveChangesAsync();

        return Ok(new { message = "Player removed from favorites succesfully" });
    }

	[HttpGet("ranking")]
	public async Task<IActionResult> GetRanking()
	{
           	var players = await _dbContext.AveragePlayerRatings
            	.FromSqlRaw("SELECT * FROM public.get_average_player_ratings()")
            	.ToListAsync();

        	return Ok(players);
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("user-ratings")]
    public async Task<IActionResult> GetRatedPlayersByUsers()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "User not authenticated" });

        var ratings = await _dbContext.PlayerRatings
            .Where(pr => pr.UserId == userId)
            .Select(pr => new
            {
                pr.PlayerId,
                pr.Rating,
                pr.DateAdded,
            })
            .ToListAsync();

        return Ok(ratings);
    }
    
    [HttpGet("player-stats")]
	public async Task<IActionResult> GetPlayerRatingStats()
	{
    	var ratings = await _dbContext.PlayerRatings
        .GroupBy(r => r.PlayerId) 
        .Select(group => new
        {
            PlayerId = group.Key,
            RatingCount = group.Count(),
            AverageRating = group.Average(r => r.Rating)
        })
        .OrderByDescending(r => r.AverageRating)
        .ToListAsync();

    	return Ok(ratings);
	}

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpDelete("rate/{playerId}")]
    public async Task<IActionResult> DeleteRating(string playerId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "User not authenticated" });

        var rating =
            await _dbContext.PlayerRatings.FirstOrDefaultAsync(pr => pr.UserId == userId && pr.PlayerId == playerId);

        if (rating == null)
            return NotFound(new { message = "Rating not found" });
        
        _dbContext.PlayerRatings.Remove(rating);
        await _dbContext.SaveChangesAsync();

        return Ok(new { message = "Rating deleted successfully" });
    }
}