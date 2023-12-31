﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using app.DataAccess;

#nullable disable

namespace app.Migrations
{
    [DbContext(typeof(MyDbContext))]
    [Migration("20230630235208_Migrations")]
    partial class Migrations
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("app.DataAccess.Roles", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    b.Property<string>("role_name")
                        .HasColumnType("longtext")
                        .HasColumnName("role_name");

                    b.HasKey("id")
                        .HasName("PRIMARY");

                    b.ToTable("roles", (string)null);
                });

            modelBuilder.Entity("app.DataAccess.Users", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    b.Property<DateTime>("created_at")
                        .HasColumnType("datetime(6)")
                        .HasColumnName("created_at");

                    b.Property<DateTime?>("deleted_at")
                        .HasColumnType("datetime(6)")
                        .HasColumnName("deleted_at");

                    b.Property<string>("password_hash")
                        .HasColumnType("longtext")
                        .HasColumnName("password_hash");

                    b.Property<int>("role_id")
                        .HasColumnType("int")
                        .HasColumnName("role_id");

                    b.Property<string>("username")
                        .HasColumnType("longtext")
                        .HasColumnName("username");

                    b.HasKey("id")
                        .HasName("PRIMARY");

                    b.ToTable("users", (string)null);
                });
#pragma warning restore 612, 618
        }
    }
}
