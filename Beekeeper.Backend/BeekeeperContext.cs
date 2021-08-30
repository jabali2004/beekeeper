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

        public DbSet<Worker> Workers { get; set; }
        public DbSet<WorkerConnection> WorkerConnections { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}