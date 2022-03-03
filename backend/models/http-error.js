class HttpError extends Error {
	//runs when this class is instantiated
	constructor(message, errorCode) {
		super(message); //adds the "messasge" property to our class based off Error
		this.code = errorCode;
	}
}

module.exports = HttpError;
