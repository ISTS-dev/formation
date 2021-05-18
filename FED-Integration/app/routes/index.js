var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('pages/index', { title: 'index' });
});

/* GET config page. */
router.get('/config', function(req, res) {
    res.render('pages/main/config', { title: 'config' });
});

/* GET calendar page. */
router.get('/calendar', function(req, res) {
    res.render('pages/main/calendar', { title: 'calendar' });
});

/* GET formations page. */
router.get('/formations', function(req, res) {
    res.render('pages/main/formations', { title: 'albums' });
});

/* GET formation page. */
router.get('/formation', function(req, res) {
    res.render('pages/main/formation', { title: 'index' });
});

/* GET formation page. */
router.get('/module', function(req, res) {
    res.render('pages/main/module', { title: 'index' });
});

/* GET formation page. */
router.get('/module-body', function(req, res) {
    res.render('pages/main/module-body', { title: 'index' });
});

/* GET formation page. */
router.get('/video', function(req, res) {
    res.render('pages/main/video', { title: 'index' });
});

/* GET article list page. */
router.get('/articles', function(req, res) {
    res.render('pages/main/articles', { title: 'index' });
});

/* GET article page. */
router.get('/article', function(req, res) {
    res.render('pages/main/article', { title: 'index' });
});

/* GET article page. */
router.get('/partners', function(req, res) {
    res.render('pages/main/partners', { title: 'index' });
});

/* GET contact page. */
router.get('/contact', function(req, res) {
    res.render('pages/main/contact', { title: 'contact' });
});

/* GET compnents template page. */
router.get('/components', function(req, res) {
    res.render('pages/template/components', { title: 'components' });
});

/* GET form template page. */
router.get('/forms', function(req, res) {
    res.render('pages/template/forms', { title: 'forms' });
});

/* GET form template page. */
router.get('/survey1', function(req, res) {
    res.render('pages/main/survey1', { title: 'forms' });
});

/* GET form template page. */
router.get('/survey2', function(req, res) {
    res.render('pages/main/survey2', { title: 'forms' });
});

/* GET form template page. */
router.get('/survey3', function(req, res) {
    res.render('pages/main/survey3', { title: 'forms' });
});

module.exports = router;
