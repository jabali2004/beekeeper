using Microsoft.AspNetCore.Identity;

namespace Beekeeper.Backend.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; }
    }
}