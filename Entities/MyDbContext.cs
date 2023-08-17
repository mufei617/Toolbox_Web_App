using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using app.Entities;

namespace app.DataAccess
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {

        }
        public DbSet<Users> users { get; set; }
        public DbSet<Roles> roles { get; set; }

       // public DbSet<Videos> videos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Users>(e =>
            {
                e.ToTable("users");
                e.HasKey(e => e.id).HasName("PRIMARY");
                e.Property(e => e.id).HasColumnName("id");
                e.Property(e => e.username).HasColumnName("username");
                e.Property(e => e.password_hash).HasColumnName("password_hash");
                e.Property(e => e.role_id).HasColumnName("role_id");
                e.Property(e => e.created_at).HasColumnName("created_at");
                e.Property(e => e.deleted_at).HasColumnName("deleted_at");
            });

            modelBuilder.Entity<Roles>(e =>
            {
                e.ToTable("roles");
                e.HasKey(e => e.id).HasName("PRIMARY");
                e.Property(e => e.id).HasColumnName("id");
                e.Property(e => e.role_name).HasColumnName("role_name");
            });
        }
    }
}
