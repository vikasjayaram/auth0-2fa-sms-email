var express = require('express');
var router = express.Router();
var passwordless = require('../lib/passwordless');
const {findOne} = require('../lib/db');
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  req.user.state = req.query.state || '';
  if (req.user.connection === 'sms') {
    // look up email for user phone number
    req.user.username = process.env.TEST_EMAIL;
    passwordless.sendEmailOtp(req.user)
    .then(userID => {
      return res.render('mfa', { title: 'Second Factor', user: req.user, action: `/mfa/verify?token=${req.query.token}` });
    })
    .catch(error => {
      return res.render('mfa', { title: 'Second Factor', error: error });
    });
  } else {
    // look up mobile for user email
    const query = {email: req.user.email};
    findOne(query)
    .then(user => {
      console.log(user);
      req.user.username = user.phone_number;
      passwordless.sendSMSOtp(req.user)
      .then(userID => {
        return res.render('mfa', { title: 'Second Factor', user: req.user, action: `/mfa/verify?token=${req.query.token}` });
      })
      .catch(error => {
        return res.render('mfa', { title: 'Second Factor', error: error });
      });
    })
    .catch(e => {
      return res.send(e)
    });
  }
});


router.post('/verify', function (req, res, next) {
  if (req.user.connection === 'sms') {
    req.user.username = process.env.TEST_EMAIL;
  } else {
    req.user.username = process.env.TEST_PHONE_NUMBER;
  }
  passwordless.verifyOtp(req.user, req.body.otp)
  .then(() => {
    return res.redirect(`https://${process.env.AUTH0_DOMAIN}/continue?state=${req.body.state}&verifyToken={}`);
  })
  .catch(error => {
    return res.render('mfa', { title: 'Second Factor', error: error });
  })
});
module.exports = router;
