using System.ComponentModel.DataAnnotations;

namespace event_service.Models
{
    public class Event
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = "";

        [Required]
        public string Description { get; set; } = "";

        [Required]
        public string Venue { get; set; } = "";

        public DateTime EventDate { get; set; }

        public decimal TicketPrice { get; set; }

        public int Capacity { get; set; }

        public decimal Budget { get; set; }

        public string ImageUrl { get; set; } = "";

        public string Category { get; set; } = "";

        public long VendorId { get; set; }

        public string VendorName { get; set; } = "";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;
    }
}
