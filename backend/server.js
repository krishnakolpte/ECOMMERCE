const app = require("./app");
const connectDatabase = require("./config/database");
const cloudinory = require("cloudinary");

//handling uncuaght Exception
process.on("uncaughtException", (error) => {
	console.log(`ERROR: ${error.message}`);
	console.log("shutting doun the server due to uncuaght Exception");
	process.exit(1);
});

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
	require("dotenv").config({ path: "config/config.env" });
}

//connecting to database
connectDatabase();

cloudinory.config({
	cloud_name: process.env.CLOUDINORY_NAME,
	api_key: process.env.CLOUDINORY_API_KEY,
	api_secret: process.env.CLOUDINORY_SECRATE_KEY,
});

const server = app.listen(process.env.PORT, () => {
	console.log(`server is working on http://localhost:${process.env.PORT}`);
});

//un handled promise rejection
process.on("unhandledRejection", (error) => {
	console.log(`ERROR: ${error.message}`);
	console.log("shutting doun the server due to unhandled promise rejection");

	server.close(() => {
		process.exit(1);
	});
});
