using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Solution.Application.Applications;
using Solution.CrossCutting.AspNetCore.Attributes;
using Solution.Model.Models;

namespace Solution.Web.App
{
    [AllowAnonymous]
    [ApiController]
    [RouteController]
    public class UserServiceController : ControllerBase
    {
        public UserServiceController(IUserApplication userApplication)
        {
            UserApplication = userApplication;
        }

        private IUserApplication UserApplication { get; }

        [HttpGet]
        [RouteAction]
        public IEnumerable<UserModel> List()
        {
            return UserApplication.List();
        }

        [HttpGet]
        [RouteAction]
        public UserModel Select(long userId)
        {
            return UserApplication.Select(userId);
        }
    }
}
