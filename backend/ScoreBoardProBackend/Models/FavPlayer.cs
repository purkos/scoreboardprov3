namespace ScoreBoardProBackend.Models;

public class FavPlayer
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public string PlayerId { get; set; }
    public DateTime DateAdded { get; set; }
}