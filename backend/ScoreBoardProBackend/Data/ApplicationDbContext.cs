using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ScoreBoardProBackend.Models;

namespace ScoreBoardProBackend.Data;

public class ApplicationDbContext: IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
        
    }
    
    public DbSet<ApplicationUser> Users { get; set; }
    public DbSet<FavPlayer> FavPlayers { get; set; }
    public DbSet<PlayerRating> PlayerRatings { get; set; }
    public DbSet<AveragePlayerRating> AveragePlayerRatings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AveragePlayerRating>()
            .HasNoKey();
    }
}