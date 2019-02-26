using Solution.CrossCutting.Security;
using Solution.Infrastructure.Database;
using Solution.Model.Enums;
using Solution.Model.Models;
using Solution.Model.Validators;

namespace Solution.Domain.Domains
{
    public sealed class AuthenticationDomain : IAuthenticationDomain
    {
        public AuthenticationDomain(
            IDatabaseUnitOfWork databaseUnitOfWork,
            IHash hash,
            IJsonWebToken jsonWebToken,
            IUserLogDomain userLogDomain)
        {
            DatabaseUnitOfWork = databaseUnitOfWork;
            Hash = hash;
            JsonWebToken = jsonWebToken;
            UserLogDomain = userLogDomain;
        }

        private IDatabaseUnitOfWork DatabaseUnitOfWork { get; }
        private IHash Hash { get; }
        private IJsonWebToken JsonWebToken { get; }
        private IUserLogDomain UserLogDomain { get; }

        public string Authenticate(AuthenticationModel authentication)
        {
            new AuthenticationValidator().ValidateThrow(authentication);

            CreateHash(authentication);

            var authenticated = DatabaseUnitOfWork.UserRepository.Authenticate(authentication);

            new AuthenticatedValidator().ValidateThrow(authenticated);

            UserLogDomain.Save(authenticated.UserId, LogType.Login);

            return CreateJwt(authenticated);
        }

        public void Logout(long userId)
        {
            UserLogDomain.Save(userId, LogType.Logout);
        }

        private void CreateHash(AuthenticationModel authentication)
        {
            authentication.Login = Hash.Create(authentication.Login);
            authentication.Password = Hash.Create(authentication.Password);
        }

        private string CreateJwt(AuthenticatedModel authenticated)
        {
            var sub = authenticated.UserId.ToString();
            var roles = authenticated.Roles.ToString().Split(", ");

            return JsonWebToken.Encode(sub, roles);
        }
    }
}
