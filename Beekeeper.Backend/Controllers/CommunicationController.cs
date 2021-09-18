using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mime;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Beekeeper.Backend.Data;
using Beekeeper.Backend.Data.Requests;
using Beekeeper.Backend.Data.Responses;
using Beekeeper.Backend.Models;
using Beekeeper.Backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Beekeeper.Backend.Controllers
{
    [Route("api/communication")]
    [Authorize(Roles = WorkerRoles.Worker)]
    [ApiController]
    public class CommunicationController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly BeekeeperContext _context;
        private readonly IMapper _mapper;

        public CommunicationController(BeekeeperContext context, IMapper mapper, IConfiguration configuration)
        {
            _configuration = configuration;
            _context = context;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("authenticate")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] WorkerAuthReq req)
        {
            var id = Guid.Parse(req.Id);
            var worker = await _context.Workers.FirstOrDefaultAsync(worker => worker.Id == id);

            var clientIp = Request.HttpContext.Connection.RemoteIpAddress?.ToString();
            var currentDateTime = DateTime.Now;

            var newConnection = new WorkerConnection
            {
                Worker = worker,
                Address = clientIp,
                Failed = false,
                ConnectedAt = currentDateTime
            };

            if (worker != null && req.LoginKey == CryptoHelper.Decrypt(worker.LoginKey))
            {
                var authClaims = new List<Claim>
                {
                    new(ClaimTypes.Role, WorkerRoles.Worker),
                    new(ClaimTypes.NameIdentifier, worker.Id.ToString())
                };

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));


                var token = new JwtSecurityToken(
                    _configuration["JWT:ValidIssuer"],
                    _configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddHours(8),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

                await _context.WorkerConnections.AddAsync(newConnection);
                await _context.SaveChangesAsync();

                return Ok(
                    new
                    {
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        expiration = token.ValidTo
                    }
                );
            }

            newConnection.Failed = true;
            await _context.WorkerConnections.AddAsync(newConnection);
            await _context.SaveChangesAsync();

            return Unauthorized(new Response
            {
                Status = "Unauthorized",
                Message = "Unable to authenticate worker!"
            });
        }
    }
}