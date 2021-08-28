using Beekeeper.Backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Beekeeper.Backend
{
    public class BeekeeperContext : IdentityDbContext<ApplicationUser>
    {
        public BeekeeperContext()
        {
        }


        public BeekeeperContext(DbContextOptions<BeekeeperContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}