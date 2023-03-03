const mongoose = require("mongoose");

const connectDatabase = async () => {
	mongoose
		.connect(
			process.env.DB_URI,
			{ useNewUrlParser: true, useUnifiedTopology: true },
			mongoose.set("strictQuery", false)
		)
		.then((data) => {
			console.log(
				`Mongodb connected with server: ${data.connection.host}`
			);
		});
};

module.exports = connectDatabase;

