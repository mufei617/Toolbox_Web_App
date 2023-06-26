﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using app.DataAccess;

namespace app.Migrations
{
    [DbContext(typeof(DbContext))]
    [Migration("20230626195739_Initial")]
    partial class Initial
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 64)
                .HasAnnotation("ProductVersion", "5.0.0");

            modelBuilder.Entity("app.DataAccess.Roles", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("role_name")
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.ToTable("roles");
                });

            modelBuilder.Entity("app.DataAccess.Users", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("created_at")
                        .HasColumnType("datetime");

                    b.Property<DateTime>("deleted_at")
                        .HasColumnType("datetime");

                    b.Property<string>("password_hash")
                        .HasColumnType("text");

                    b.Property<string>("password_salt")
                        .HasColumnType("text");

                    b.Property<int>("role_id")
                        .HasColumnType("int");

                    b.Property<string>("username")
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.ToTable("users");
                });
#pragma warning restore 612, 618
        }
    }
}
