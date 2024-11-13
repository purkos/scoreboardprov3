namespace ScoreBoardProBackend.Models;

public class PlayerRating
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public ApplicationUser User { get; set; }
    
    public double Rating { get; set; }
    public string PlayerId { get; set; }
    public DateTime DateAdded { get; set; }
}