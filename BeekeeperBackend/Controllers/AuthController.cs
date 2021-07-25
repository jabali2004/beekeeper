using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BeekeeperBackend.Models;
using BeekeeperBackend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BeekeeperBackend.Controllers
{
    
    // TODO: Refactor and enhance auth controller
    // TODO: Implement roles
    
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                // var userRoles = await userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new(ClaimTypes.Name, user.UserName),
                    new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                // foreach (var userRole in userRoles) authClaims.Add(new Claim(ClaimTypes.Role, userRole));

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

                var token = new JwtSecurityToken(
                    _configuration["JWT:ValidIssuer"],
                    _configuration["JWT:ValidAudience"],
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

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] Register model)
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