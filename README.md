# auth0-2fa-sms-email
Auth0 2FA using Passwordless and Redirect Rules

### Setting up Passwordless Client
Create a new application in Auth0 Dashboard and choose Regular Web Application type.


 

Click on the Advanced Section by scrolling down and enable only Passwordless OTP grant type


 

Click on the connections tab, and enable passwordless Email and SMS connections


Enable Trust Token Endpoint IP Header to set header `auth0-forwarded-for` as trusted to be used as source of end user ip for brute-force-protection on token endpoint.


Setting the Rule
Rule Environment Variables To Be Set In Auth0 Dashboard
PASSWORDLESS_ISSUER

The issuer in the signed token using HS256

PASSWORDLESS_CLIENT_SECRET

The client_secret to sign token using HS256

PROGRESSIVE_PROFILE_SPA_URL

The absolute url to this SPA application.

### Running it locally
- copy `.env.sample` to `.env` file and update the values as required.
- Run `npm install`
- Run `npm start`
