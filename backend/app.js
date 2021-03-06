const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const config = require("./util/config");

const app = express();

//this will parse incoming request body and extract JSON data to convert to JS
app.use(bodyParser.json());

//statically serving images
//files in the uploads/images file if requested will be returned
app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
	//allows any domain to send requests
	res.setHeader("Access-Control-Allow-Origin", "*");
	//Controls what headers may be used within the frontend
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	//controls which HTTP methods may be used within the frontend
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

	next();
});

//filters to only paths that have /api/places
app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
	const error = new HttpError("Could not find this route", 404);
	throw error;
});

//this is executed on only requests with an error thrown
app.use((error, req, res, next) => {
	//multer provides a file property to the request object
	if (req.file) {
		fs.unlink(req.file.path, (err) => {
			console.log(err);
		});
	}
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || "Something went wrong!" });
});

mongoose
	.connect(config.mongoLink)
	.then(() => {
		app.listen(5000, () => {
			console.log("Listening on port 5000");
		});
	})
	.catch((err) => {
		console.log(err);
	});
