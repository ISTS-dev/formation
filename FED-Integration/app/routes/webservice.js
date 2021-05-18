var express = require('express');
var router = express.Router();

/* GET POPIN */
router.get('/webservice/vortex/getpopin', (req, res) => {
    if (req.query.page == 'login') {
        res.render('pages/webservices/vortex/login-form', { data: req.body });
    } else if (req.query.page == 'register') {
        res.render('pages/webservices/vortex/register-form', { data: req.body });
    } else if (req.query.page == 'register-intro') {
        res.render('pages/webservices/vortex/register-intro', { data: req.body });
    } else if (req.query.page == 'reset-password') {
        res.render('pages/webservices/vortex/reset-password', { data: req.body });
    }
});

/* POST Login Callback. */
router.post('/webservice/vortex/postlogin', (req, res) => {
    res.render('pages/webservices/vortex/postlogin', { data: req.body });
});

/* POST Registration Callback. */
router.post('/webservice/vortex/postregistration', (req, res) => {
    res.render('pages/webservices/vortex/postregistration', { data: req.body });
});

/* POST Reset Password Callback. */
router.post('/webservice/vortex/postresetpwd', (req, res) => {
    res.render('pages/webservices/vortex/postresetpwd', { data: req.body });
});

/* POST Change Password Callback. */
router.post('/webservice/vortex/postchangepwd', (req, res) => {
    res.render('pages/webservices/vortex/postchangepwd', { data: req.body });
});

/* POST Update Profile Callback. */
router.post('/webservice/vortex/postupdateprofile', (req, res) => {
    res.render('pages/webservices/vortex/postupdateprofile', { data: req.body });
});

module.exports = router;
