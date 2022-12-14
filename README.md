# VueJS SPA with ExpressJS Backend for Front End

This project aims to demonstrate how a single page application, hosted on the
same domain as a backend service can use standard cookie based session
management instead Oauth tokens managed and stored client side.

Tokens stored in the web browser are vulnerable to theft via cross-site
scripting attacks. The Backend for Front End or "Token Handler" pattern are the
recommended approach for mitigating this risk as tokens never leave the backend
server.

## Running

- Setup an application integration in Okta
- Note the client id, client secret, and org domain
- Assign a user to the application
- Copy .env.example to .env
- Populate .env with Okta information and a JWT signing key of your choosing
- From the backend directory run `npm install`
- From the proxied directory run `npm install`
- From the spa directory run `npm install` and `npm run build`
- In another terminal window form the root of the project run `docker-compose up --build`
- Visit the application in your browser at http://localhost:7000

## Words of Warning

This project is for demonstration purposes only and is not production ready. It
is missing things such as CSRF token functionality, session fixation prevention,
session timeout, secure flag on session cookie, etc.

## References

- https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps#name-security-considerations
- https://auth0.com/docs/secure/security-guidance/data-security/token-storage
- https://www.pingidentity.com/en/resources/blog/post/refresh-token-rotation-spa.html
- https://auth0.com/blog/backend-for-frontend-pattern-with-auth0-and-dotnet/

