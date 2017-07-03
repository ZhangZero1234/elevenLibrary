//json
// {
// 		intrID:xxxx@cn.ibm.com,
// 		time:xxxx:xx:xx,
// 		action:login,
// 		what:{id:xxx,isbn:xxxx,name:xxxx..........}
// }

module.exports = function(res,db,database,json){
	
	db.get(database,function(err,logs){
		if(err)
		{
			console.log("open logDb error:"+err);
		}
		else{
			logs.data.push(json);
			db.insert(logs,function(err){
			  if(err)
              {
                console.log("insert logs err :"+err);
                res.send({
                  errType: 1
                });
              }
			});
		}
	});
}