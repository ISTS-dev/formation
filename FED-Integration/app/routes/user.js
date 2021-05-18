var express = require('express');
var router = express.Router();


const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { table } = require('console');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = '../token.json';

// // Load client secrets from a local file.


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  

  return new Promise((resolve, reject) => {
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        
        let call =  callback(oAuth2Client);
        call.then((tab)=>{
            
            resolve(tab);
        })
        
      });
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  let tab = [];

  return new Promise((resolve, reject) => {
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
          console.log('Upcoming 10 events:');
          
          events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            tab.push(`${start} - ${event.summary}`);
          });
            resolve(tab);
          
        } else {
          console.log('No upcoming events found.');
        }
      })
  });

  
  
  
  
}

/* GET user details. */
router.get('/profile', function(req, res) {
    res.render('pages/profile/profile', { title: 'index' });
});

/* GET user details edit page. */
router.get('/edit-profile', function(req, res) {
    res.render('pages/profile/edit-profile', { title: 'index' });
});

/* GET user details edit page. */
router.get('/change-password', function(req, res) {
    res.render('pages/profile/change-password', { title: 'index' });
});

/* GET user password reset page. */
router.get('/reset-password', function(req, res) {
    res.render('pages/profile/reset-password', { title: 'index' });
});

/* GET user password change page. */
router.get('/change-password', function(req, res) {
    res.render('pages/profile/change-password', { title: 'index' });
});

/* GET user login page. */
router.get('/login', function(req, res) {
    res.render('pages/profile/login', { title: 'index' });
});

/* GET user registration page. */
router.get('/registration', function(req, res) {
    fs.readFile('../credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Calendar API.
        let x=authorize(JSON.parse(content), listEvents);
        x.then((tab)=>{
            console.log("tab auth xxxxx",tab);
            res.render('pages/profile/registration', { title: tab });
        })
      });
    
});

module.exports = router;
