var request = require('request');

let sendEmailOtp = (context) => new Promise((resolve, reject) => {
    const url = `https://${process.env.AUTH0_DOMAIN}/passwordless/start`;
    var headers = {
        'auth0-forwarded-for': context.ip
    };
    const requestJson = {
        "client_id": process.env.PASSWORDLESS_CLIENT_ID,
        "client_secret": process.env.PASSWORDLESS_CLIENT_SECRET,
        "connection": "email",
        "email": context.username,
        "send": "code"
    };
    // callback for send otp
    let sendEmailOtpCallback = (err, response, body) => {
        console.log(`[sendOtp] response: ${JSON.stringify(response)}`);
        if (err) {
            console.error(`[sendOtp] rejecting promise: ${err}`);
            reject(err);
        } else {
            if (response.statusCode === 200) {
                let pwdlessUserId = body._id;
                console.log(`[sendEmailOtp] resolving promise with pwdlessUserId: ${pwdlessUserId}`);
                resolve(pwdlessUserId);
            } else {
                console.error("[sendOtp] rejecting promise");
                reject("[sendEmailOtp] failed");
            }
        }
    };
    request.post({
        url: url,
        headers: headers,
        json: requestJson
    }, sendEmailOtpCallback);
});

let sendSMSOtp = (context) => new Promise((resolve, reject) => {
    const url = `https://${process.env.AUTH0_DOMAIN}/passwordless/start`;
    var headers = {
        'auth0-forwarded-for': context.ip
    };
    const requestJson = {
        "client_id": process.env.PASSWORDLESS_CLIENT_ID,
        "client_secret": process.env.PASSWORDLESS_CLIENT_SECRET,
        "connection": "sms",
        "phone_number": context.username,
        "send": "code"
    };
    // callback for send otp
    let sendSMSOtpCallback = (err, response, body) => {
        console.log(`[sendOtp] response: ${JSON.stringify(response)}`);
        if (err) {
            console.error(`[sendOtp] rejecting promise: ${err}`);
            reject(err);
        } else {
            if (response.statusCode === 200) {
                let pwdlessUserId = body._id;
                console.log(`[sendSMSOtp] resolving promise with pwdlessUserId: ${pwdlessUserId}`);
                resolve(pwdlessUserId);
            } else {
                console.error("[sendOtp] rejecting promise");
                reject("[sendSMSOtp] failed");
            }
        }
    };
    request.post({
        url: url,
        headers: headers,
        json: requestJson
    }, sendSMSOtpCallback);
});

let verifyOtp = (context, otp) => {
    return new Promise((resolve, reject) => {
        var headers = {
            'auth0-forwarded-for': context.ip
        };
        const requestJson = {
            "grant_type": "http://auth0.com/oauth/grant-type/passwordless/otp",
            "client_id": process.env.PASSWORDLESS_CLIENT_ID,
            "client_secret": process.env.PASSWORDLESS_CLIENT_SECRET,
            "username": context.username,
            "otp": otp,
            "realm": context.connection === "sms" ? "email" : "sms"
        };

        // callback for otp verify
        let verifyOtpCallback = (err, response, body) => {

            if (err) {
                // oauth token request failed for some reason
                console.error(`[verifyOtp] rejecting promise: ${err}`);
                reject("[verifyOtp] failed");
            } else {
                console.info(`[verifyOtp] response: ${JSON.stringify(response)}`);
                if (response.statusCode === 200) {
                    console.log("[verifyOtp] resolving promise");
                    resolve();
                } else {
                    console.error("[verifyOtp] rejecting promise");
                    reject("[verifyOtp] failed");
                }
            }
        };

        const url = `https://${process.env.AUTH0_DOMAIN}/oauth/token`;
        request.post({
            url: url,
            headers: headers,
            json: requestJson
        }, verifyOtpCallback);
    });
};
module.exports = {
    sendEmailOtp: sendEmailOtp,
    sendSMSOtp: sendSMSOtp,
    verifyOtp: verifyOtp
}