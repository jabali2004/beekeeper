using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using BeekeeperBackend.Models;

#nullable disable

namespace BeekeeperBackend
{
    public partial class BeekeeperContext : DbContext
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

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
