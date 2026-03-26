using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using event_service.Data;
using event_service.Models;

namespace event_service.Controllers
{
    [ApiController]
    [Route("api/events")]
    public class EventsController : ControllerBase
    {
        private readonly EventDbContext _context;

        public EventsController(EventDbContext context)
        {
            _context = context;
        }

        // GET all active events
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var events = await _context.Events
                .Where(e => e.IsActive)
                .OrderByDescending(e => e.EventDate)
                .ToListAsync();
            return Ok(events);
        }

        // GET events by vendor
        [HttpGet("vendor/{vendorId}")]
        public async Task<IActionResult> GetByVendor(long vendorId)
        {
            var events = await _context.Events
                .Where(e => e.VendorId == vendorId)
                .ToListAsync();
            return Ok(events);
        }

        // GET single event by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ev = await _context.Events.FindAsync(id);
            if (ev == null) return NotFound();
            return Ok(ev);
        }

        // POST create event
        [HttpPost]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Event newEvent)
        {
            // Check if role is VENDOR
            if (string.IsNullOrEmpty(newEvent.VendorName) || newEvent.VendorId == 0)
            {
                return BadRequest(new { error = "Only vendors can create events" });
            }

            newEvent.CreatedAt = DateTime.UtcNow;
            newEvent.IsActive = true;
            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById),
                new { id = newEvent.Id }, newEvent);
        }

        // PUT update event
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Event updated)
        {
            var ev = await _context.Events.FindAsync(id);
            if (ev == null) return NotFound();

            ev.Title = updated.Title;
            ev.Description = updated.Description;
            ev.Venue = updated.Venue;
            ev.EventDate = updated.EventDate;
            ev.TicketPrice = updated.TicketPrice;
            ev.Capacity = updated.Capacity;
            ev.Budget = updated.Budget;
            ev.ImageUrl = updated.ImageUrl;
            ev.Category = updated.Category;

            await _context.SaveChangesAsync();
            return Ok(ev);
        }

        // DELETE event (soft delete)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ev = await _context.Events.FindAsync(id);
            if (ev == null) return NotFound();
            ev.IsActive = false;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Event deleted" });
        }

        // GET all events including inactive (admin)
        [HttpGet("admin/all")]
        public async Task<IActionResult> GetAllAdmin()
        {
            var events = await _context.Events.ToListAsync();
            return Ok(events);
        }
    }
}
