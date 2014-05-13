// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'githubAuth' : {
		'clientID' 		: 'your-secret-clientID-here',
		'clientSecret' 	: 'your-client-secret-here',
		'callbackURL' 	: 'http://localhost:4000/auth/github/callback'
	}

};
