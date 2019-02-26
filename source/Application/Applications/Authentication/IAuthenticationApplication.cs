using Solution.Model.Models;

namespace Solution.Application.Applications
{
    public interface IAuthenticationApplication
    {
        string Authenticate(AuthenticationModel authentication);

        void Logout(long userId);
    }
}
