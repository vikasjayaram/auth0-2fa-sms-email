function handle2fa(user, context, mainCallback) {

    // skip this rule for ROPG
    if (context.protocol === "oauth2-password") {
        return mainCallback(null, user, context);
    }
    // check if we have returned using a /continue request
    if (context.protocol === "redirect-callback") {
        context.request
        context.idToken['https://identity.2fa.site/mfa'] = true;
        return mainCallback(null, user, context);
    }

    // force stepup
    forceStepUp();

    function forceStepUp(){
        const request = require('request');

        // rule environment variables
        const pwdlessClientSecret = configuration.PASSWORDLESS_CLIENT_SECRET;
        const progressivePrileSpaUrl = configuration.PROGRESSIVE_PROFILE_SPA_URL;
        const issuer = configuration.PASSWORDLESS_ISSUER;

        // global variables
        let databaseUserId;

        let createToken = (clientSecret, issuer, user) => {
            const options = {
                expiresInMinutes: 5,
                audience: clientId,
                issuer: issuer
              };
              return jwt.sign(user, clientSecret, options);
        }
        // trigger redirect to otp collection SPA
        let collectOtp = () => {
            context.redirect = {
                url: `${progressivePrileSpaUrl}?token=${createToken(pwdlessClientSecret, issuer, {
                    user_id: user.user_id,
                    email: user.email,
                    phone_number: user.phone_number || user.user_metadata.mobile,
                    connection: context.connection,
                    ip: context.request.ip
                })}`
            };
            return mainCallback(null, user, context);
        };
    }
}
