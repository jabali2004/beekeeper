using Microsoft.AspNetCore.Identity;

namespace BeekeeperBackend.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName {  get; set; }
    }
}