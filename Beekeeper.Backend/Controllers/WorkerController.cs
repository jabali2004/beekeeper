using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Beekeeper.Backend.Data.DTOs;
using Beekeeper.Backend.Data.Requests;
using Beekeeper.Backend.Data.Responses;
using Beekeeper.Backend.Models;
using Beekeeper.Backend.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Beekeeper.Backend.Controllers
{
    [Route("api/worker")]
    [ApiController]
    public class WorkerController : ControllerBase
    {
        private readonly BeekeeperContext _context;
        private readonly IMapper _mapper;

        public WorkerController(BeekeeperContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Worker
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkerDTO>>> GetWorkers()
        {
            var workers = await _context.Workers.ToListAsync();

            return Ok(_mapper.Map<List<WorkerDTO>>(workers));
        }

        // GET: api/Worker/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WorkerDTO>> GetWorker(Guid id)
        {
            var worker = await _context.Workers.FindAsync(id);

            if (worker == null) return NotFound();

            return Ok(_mapper.Map<WorkerDTO>(worker));
        }

        // PUT: api/Worker/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<WorkerDTO>> PutWorker(Guid id, UpdateWorkerReq updatedWorker)
        {
            var worker = _mapper.Map<Worker>(updatedWorker);

            if (id != worker.Id)
                return BadRequest(
                    new Response { Message = "Url id and request id does not match!", Status = "BadRequest" }
                );

            _context.Entry(worker).State = EntityState.Modified;


            if (worker.LoginKey != null) worker.LoginKey = CryptoHelper.Encrypt(worker.LoginKey);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorkerExists(id))
                    return NotFound();
                throw;
            }

            return Ok(_mapper.Map<WorkerDTO>(worker));
        }

        // POST: api/Worker
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<WorkerDTO>> PostWorker(CreateWorkerReq createdWorker)
        {
            var worker = _context.Workers.Add(_mapper.Map<Worker>(createdWorker)).Entity;

            if (worker.LoginKey != null)
                worker.LoginKey = CryptoHelper.Encrypt(worker.LoginKey);
            else
                return BadRequest(new Response { Message = "LoginKey is missing!", Status = "BadRequest" });

            DateTime currentDateTime = DateTime.Now;
            worker.CreatedAt = currentDateTime;
            worker.UpdatedAt = currentDateTime;

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWorker", new { worker.Id }, _mapper.Map<Worker>(worker));
        }

        // DELETE: api/Worker/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteWorker(Guid Id)
        {
            var worker = await _context.Workers.FindAsync(new Worker { Id = Id });
            if (worker == null) return NotFound();

            _context.Workers.Remove(worker);
            await _context.SaveChangesAsync();

            return Ok(new Response
            {
                Message = "Successfully deleted worker!",
                Status = "Success"
            });
        }

        private bool WorkerExists(Guid id)
        {
            return _context.Workers.Any(e => e.Id == id);
        }
    }
}