using Microsoft.EntityFrameworkCore;
using event_service.Models;

namespace event_service.Data
{
    public class EventDbContext : DbContext
    {
        public EventDbContext(DbContextOptions<EventDbContext> options) 
            : base(options) { }

        public DbSet<Event> Events { get; set; }
    }
}