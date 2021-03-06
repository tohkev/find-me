const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controller");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

//requests sent to the routes below require a middleware to verify token
router.use(checkAuth);

//check is a middleware that validates if a field meets certain conditions (title is not empty or description meets minimum length in this case)
router.post(
	"/",
	fileUpload.single("image"),
	[
		check("title").not().isEmpty().withMessage("must not be empty"),
		check("description")
			.isLength({ min: 5 })
			.withMessage("must have at least 5 characters"),
		check("address").not().isEmpty().withMessage("must not be empty"),
	],
	placesControllers.createPlace
);

router.patch(
	"/:pid",
	[
		check("title").not().isEmpty().withMessage("must not be empty"),
		check("description")
			.isLength({ min: 5 })
			.withMessage("must have at least 5 characters"),
	],
	placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
