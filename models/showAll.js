
var exports = function(req, res) {
	var db = req.app.get("db");
	
	db.list(/* @callback */ function(err, data) {
		var result = [];
		if (err) {
			res.json({err:err});
			return;
		}
		iteration(0,data,db,result,res);
	});
};
function iteration(i,data,db,result,res){
			
			if(i === data.rows.length)
			{
				res.send(result);
				return;
			}
			db.get(data.rows[i].id, function(err, da) {
				if (err) {
					res.json({err:err});
					return;
				}
				
				result.push(da);
				iteration(++i,data,db,result,res);
			});
		}
module.exports = exports;