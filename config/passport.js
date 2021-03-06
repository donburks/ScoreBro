// load all the things we need
var LocalStrategy    = require('passport-local').Strategy,
	GitHubStrategy   = require('passport-github').Strategy,

// load up the user model
	User       = require('../app/models/user'),

// load the auth variables
	configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField 		: 'email',
        passwordField 		: 'password',
        passReqToCallback	: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email) {
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
		}

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err) { return done(err);  }

                // if no user is found, return the message
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
				}

                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
				} else {
					// all is well, return user
                    return done(null, user);
				}
            });
        });
    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField 		: 'email',
        passwordField 		: 'password',
        passReqToCallback	: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email) {
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
		}

        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err) { return done(err); }

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        // create the user
                        var newUser            = new User();

                        newUser.local.email    = email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err) { throw err; }

                            return done(null, newUser);
                        });
                    }
                });
            // if the user is logged in but has no local account...
            } else if ( !req.user.local.email ) {
                // ...presumably they're trying to connect a local account
                var user            = req.user;
                user.local.email    = email;
                user.local.password = user.generateHash(password);
                user.save(function(err) {
                    if (err) { throw err; }

                    return done(null, user);
                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }
        });
    }));

    // =========================================================================
    // GITHUB ==================================================================
    // =========================================================================
    passport.use(new GitHubStrategy({
        clientID        	: configAuth.githubAuth.clientID,
        clientSecret    	: configAuth.githubAuth.clientSecret,
        callbackURL     	: configAuth.githubAuth.callbackURL,
        passReqToCallback	: true // allows passing req from route (lets us check if user is logged in)
    },
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {
                User.findOne({ 'github.id' : profile.id }, function(err, user) {
                    if (err) {
                        return done(err);
					}

                    if (user) {
                        // if user id exists but no token (user was linked and then removed)
                        if (!user.github.token) {
                            user.github.token = token;
                            user.github.name  = profile.displayName;
                            user.github.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                            user.save(function(err) {
                                if (err) { throw err; }

                                return done(null, user);
                            });
                        }

                        return done(null, user);
                    } else {
                        var newUser          = new User();

                        newUser.github.id    = profile.id;
                        newUser.github.token = token;
                        newUser.github.name  = profile.displayName;
                        newUser.github.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                        newUser.save(function(err) {
                            if (err) { throw err; }

                            return done(null, newUser);
                        });
                    }
                });
            } else {
                // user already exists and is logged in, we have to link accounts
                var user          = req.user; // pull the user out of the session

                user.github.id    = profile.id;
                user.github.token = token;
                user.github.name  = profile.displayName;
                user.github.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                user.save(function(err) {
                    if (err) { throw err; }

                    return done(null, user);
                });
            }
        });
    }));
};
