const passport = require('passport');

const ensureAuth = passport.authenticate('jwt', {session: false});

module.exports = ensureAuth; 