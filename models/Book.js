var mongoose = require('mongoose');
var BookSchema = new mongoose.Schema({
	unqId: String,
	isbn: String,
	name: String,
	status: Number,//0-free,1-reserved,2-borrowed
	applyTime: Date,
	borrowTime: Date,
	returnTime: Date,
	intrID: String,
	borrower : [{intrID: String, name: String }]
});

module.exports = mongoose.model('Book', BookSchema);

// read a document specified by the id / _id in GET or POST
// var exports = function(req, res) {
// 	var db = req.app.get('db');
	
// //	var id = req.query._id || req.query.id || req.body._id || req.body.id || "";
// //	if (id != "") {
// //	get Book doc
// 		db.get("1", function(err, data) {
// 			if (err) {
// 				res.json({err:err});
// 				return;
// 			}

// 			res.json({data:data});
// 		});
// //	} else {
// //		res.json({err:"Please specify an id or _id to read"});
// //	}
// };

// module.exports = exports;