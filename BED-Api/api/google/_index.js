const fs = require('fs');
const readline = require('readline');
const {
	google
} = require('googleapis');
const {
	table
} = require('console');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = './api/google/token.json';

class googleAPI {

	/**
	 * Create an OAuth2 client with the given credentials, and then execute the
	 * given callback function.
	 * @param {Object} credentials The authorization client credentials.
	 * @param {function} callback The callback to call with the authorized client.
	 */
	authorize(credentials, callback) {
		const {
			client_secret,
			client_id,
			redirect_uris
		} = credentials.web;
		const oAuth2Client = new google.auth.OAuth2(
			client_id, client_secret, redirect_uris[0]);
		return new Promise((resolve, reject) => {
			// Check if we have previously stored a token.
			fs.readFile(TOKEN_PATH, (err, token) => {
				if (err) return this.getAccessToken(oAuth2Client, callback);
				oAuth2Client.setCredentials(JSON.parse(token));
				let call = callback(oAuth2Client);
				call.then((tab) => {
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
	getAccessToken(oAuth2Client, callback) {
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
	listEvents(auth) {
		const calendar = google.calendar({
			version: 'v3',
			auth
		});
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

	getEventList() {
		return new Promise((resolve, reject) => {
			fs.readFile('./api/google/credentials.json', (err, content) => {
				if (err) return console.log('Error loading client secret file:', err);
				// Authorize a client with credentials, then call the Google Calendar API.
				let listEvents = this.authorize(JSON.parse(content), this.listEvents);
				listEvents.then((events) => {
					resolve(events)
				})
			});
		})
	}
}

module.exports = googleAPI;
