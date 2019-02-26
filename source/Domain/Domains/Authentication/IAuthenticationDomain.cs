using Solution.Model.Models;

namespace Solution.Domain.Domains
{
    public interface IAuthenticationDomain
    {
        string Authenticate(AuthenticationModel authentication);

        void Logout(long userId);
    }
}
