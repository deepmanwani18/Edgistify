const router = require("express").Router();

const ensureAuth = require('../utils/ensureAuth');

router.get('/', ensureAuth, (req, res) => {
    res.send('dsad');
});

module.exports = router;