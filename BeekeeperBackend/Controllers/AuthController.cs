using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using BeekeeperBackend.Models;
using BeekeeperBackend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;

namespace BeekeeperBackend.Controllers
{

    // TODO: Refactor and enhance auth controller
    // TODO: Implement roles

    [Authorize]
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly BeekeeperContext _context;
        private readonly IMapper _mapper;

        public AuthController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, BeekeeperContext beekeeperContext,
            IConfiguration configuration, IMapper mapper
            )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _context = beekeeperContext;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginReq model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                // var userRoles = await userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                };

                // foreach (var userRole in userRoles) authClaims.Add(new Claim(ClaimTypes.Role, userRole));

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

                var token = new JwtSecurityToken(
                         issuer: _configuration["JWT:ValidIssuer"],
                         audience: _configuration["JWT:ValidAudience"],
                         expires: DateTime.Now.AddHours(3),
                         claims: authClaims,
                         signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                         );

                return Ok(
                    new
                    {
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        expiration = token.ValidTo
                    }
                );
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterReq model)
        {
            var userExists = await _userManager.FindByNameAsync(model.Username);
            if (userExists != null)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new Response
                    {
                        Status = "Error",
                        Message = "User already exists!"
                    }
                );
            }

            var user = new ApplicationUser
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new Response
                    {
                        Status = "Error",
                        Message = "User creation failed! Please check user details and try again."
                    }
                );
            }

            return Ok(
                new Response
                {
                    Status = "Success",
                    Message = "User created successfully!"
                }
            );
        }

        [HttpGet]
        [Route("profile")]
        public async Task<ActionResult<UserDTO>> GetUser()
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            ApplicationUser user = await _userManager.FindByIdAsync(userId);

            return Ok(_mapper.Map<UserDTO>(user));
        }

        // [HttpPost]
        // [Route("register-admin")]
        // public async Task<IActionResult> RegisterAdmin([FromBody] Register model)
        // {
        //     var userExists = await userManager.FindByNameAsync(model.Username);
        //
        //     if (userExists != null)
        //     {
        //         return StatusCode(
        //             StatusCodes.Status500InternalServerError,
        //             new Response
        //             {
        //                 Status = "Error",
        //                 Message = "User already exists!"
        //             }
        //         );
        //     }
        //
        //     var user = new ApplicationUser
        //     {
        //         Email = model.Email,
        //         SecurityStamp = Guid.NewGuid().ToString(),
        //         UserName = model.Username
        //     };
        //
        //     var result = await userManager.CreateAsync(user, model.Password);
        //
        //     if (!result.Succeeded)
        //     {
        //         return StatusCode(
        //             StatusCodes.Status500InternalServerError,
        //             new Response
        //             {
        //                 Status = "Error",
        //                 Message = "User creation failed! Please check user details and try again."
        //             }
        //         );
        //     }
        //
        //
        //     // if (!await roleManager.RoleExistsAsync(UserRoles.Admin))
        //     //     await roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
        //     //
        //     // if (!await roleManager.RoleExistsAsync(UserRoles.User))
        //     //     await roleManager.CreateAsync(new IdentityRole(UserRoles.User));
        //     //
        //     // if (await roleManager.RoleExistsAsync(UserRoles.Admin))
        //     //     await userManager.AddToRoleAsync(user, UserRoles.Admin);
        //
        //     return Ok(
        //         new Response
        //         {
        //             Status = "Success",
        //             Message = "User created successfully!"
        //         }
        //     );
        // }
    }
}