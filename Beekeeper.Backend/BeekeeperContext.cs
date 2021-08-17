using System;
using BeekeeperBackend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace BeekeeperBackend
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
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            base.OnModelCreating(modelBuilder);
        }
    }
}