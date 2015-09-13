var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOLAB_URI ||
				process.env.MONGOHQ_URL ||
				"mongodb://localhost/football_depthchart");
module.exports.User = require("./user");

// mongoose.connect("mongodb://localhost/big_project_1", function(){
//    mongoose.connection.db.dropDatabase();
// });