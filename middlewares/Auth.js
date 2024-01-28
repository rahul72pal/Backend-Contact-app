const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports.auth = async (req, res, next) => {
    try {
        if (req.sessionID) {
            res.status(200).json({
                success: true,
                message: "User has session id"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "User does not have a session id"
            });
        }
        // Call next() here if you want to continue to the next middleware or route handler
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: 'Error in authorization',
        });
        // If you want to call next in case of an error, put it here
        next(error);
    }
};


