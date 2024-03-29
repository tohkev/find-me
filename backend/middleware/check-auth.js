const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
	//checks to see if the options method is passed first, and if so it moves it along
	if (req.method === "OPTIONS") {
		return next();
	}

	//token encoded in the header of the request to keep the url clean
	try {
		const token = req.headers.authorization.split(" ")[1]; //Authorization : 'Bearer TOKEN'
		if (!token) {
			throw new Error("Authentication failed!", 403);
		}

		const decodedToken = jwt.verify(token, process.env.JWT_KEY); //returns payload
		//adding user date to the request
		req.userData = { userId: decodedToken.userId };
		next();
	} catch (err) {
		const error = new HttpError("Authentication failed!", 403);
		return next(error);
	}
};
