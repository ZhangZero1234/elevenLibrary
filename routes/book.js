var Book = require('../models/Book.js');
var BookProp = require('../models/BookProp.js');
var History = require('../models/History.js');
var filter = require('../models/Filter.js');
var database = require("./database_setting.js");
var log_operate = require("./log_operation.js");

module.exports = function(app) {
	app.get('/admin/add/book/:isbn', filter.adminAuthorize, function(req, res){
		// BookProp.findOne({isbn: req.params.isbn}, function(err, bookprop){
		// 	res.json(bookprop);
		// });
		var db = req.app.get('db');
		db.get(database.detailsDb,function(err, booksprop){
			for(var i = 0 ; i < booksprop.data.length ; i++)
			{
				if(booksprop.data[i].isbn == req.params.isbn)
				{
					break;
					res.send(booksprop.data[i]);
				}
			}	
		});
	});//search the isbn info when add a book

	// app.post('/admin/books', function(req, res){
	// 	// console.log(req.body);
	// 	var param = req.body;

	// 	// status: param.status==0?param.status:0, //0-free,1-reserved,2-borrowed
	// 	var newBook = {
	// 		unqId: param.unqId,
	// 		isbn: param.isbn,
	// 		status: 0,
	// 		name: param.name,
	// 		category: param.category,
	// 		intrID: param.intrID,
	// 	};


	// 	Book.findOne({
	// 		unqId : newBook.unqId
	// 	},function(err, book){
	// 		if(err) {
	//           console.log('[Add a book]DB find a book err : '+ err);
	//         }
	//         else if(book){
	// 			console.log('[Add a book]This book exists');
	//             res.json({
	//               'errType': 1
	//             });
	//         }else{
	//         	Book.create(newBook, function(err, newBook){
	//         		if(err) {
	// 					console.log('[Add a book]DB insert book err : '+ err);
	// 					res.json({
	// 						'errType': 3
	// 					});
	// 	            }
	// 	            else if(!newBook){
	// 	            	console.log('[Add a book]DB insert book Fail');
	// 	            	res.json({
	// 		                'errType': 3
	// 		            });
	// 	            }else{
	// 	            	BookProp.findOne({
	// 	            		isbn: newBook.isbn
	// 	            	}, function(err, bookprop){
	// 	            		if(err) {
	// 							console.log('[Add a book]Find isbn err : '+ err);
	// 			            }
	// 			            else if(bookprop){
	// 			      //       	BookProp.update({isbn: bookprop.isbn},{count: bookprop.count+1}, function(err, bookprop1){
	// 			      //       		if(err){
	// 			      //       			console.log('[Update bookProp]update bookprop count err : ' + err);
	// 									// res.json({
	// 									// 	'errType': 3
	// 									// });
	// 			      //       		}
	// 			      //       		else if(bookprop1.nModified){
	// 			      //       			console.log('[Update bookProp]update bookprop count Successfull');
	// 			      //       			// console.log(bookprop1);
	// 									// res.json({
	// 									// 	'errType': 0
	// 									// });
	// 			      //       		}else{
	// 			      //       			console.log('[Update bookProp] No update for bookprop');
	// 									// res.json({
	// 									// 	'errType': 3
	// 									// });
	// 			      //       		}
	// 			      //       	});
	// 							var amdfBook = {
	// 								name: param.name,
	// 								image: param.image,
	// 								category: param.category,
	// 								author: param.author,
	// 								publisher: param.publisher,
	// 								pageCount: param.pageCount,
	// 								price: param.price,
	// 								desc: param.desc,
	// 								count: bookprop.count+1,
	// 							}
	// 							// console.log(amdfBook);

	// 							BookProp.update({isbn: param.isbn}, amdfBook, function(err, ambookprop){
	// 								if(err) {
	// 						          console.log('[update bookprop info]update book info err : '+ err);
	// 						          //delete the book just added
	// 						          res.json({
	// 						            'errType': 3
	// 						          });
	// 						        }
	// 						        else if(ambookprop.ok || ambookprop.nModified){
	// 									console.log(ambookprop.nModified);
	// 									Book.update({isbn: param.isbn},{name: amdfBook.name}, function(err, ambook){
	// 										if(err){
	// 											console.log('[update book info]update book name err : '+ err);
	// 										}
	// 										else if(ambook.ok || ambook.nModified){
	// 											console.log('[update book info]update book Successfull');
	// 											res.json({
	// 											'errType': 0
	// 											});
	// 										}else{
	// 											console.log('[update book name]update book name Fail');
	// 										}
	// 									});
	// 						        }else{
	// 						        	console.log('[update book info]update book Fail');
	// 									res.json({
	// 									'errType': 3
	// 									});
	// 						        }
	// 							});

	// 			            }else{
	// 			            	var newBookProp = {
	// 								isbn: param.isbn,
	// 								name: param.name,
	// 								category: param.category,
	// 								desc: param.desc,
	// 								publisher: param.publisher,
	// 								author: param.author,
	// 								pageCount: param.pageCount,
	// 								price: param.price,
	// 								count: 1,
	// 								image: param.image
	// 			            	};
	// 			            	BookProp.create(newBookProp, function(err, newBookProp){
	// 			            		if(err){
	// 			            			console.log('[Add a bookProp]Insert bookprop err : '+ err);
	// 									res.json({
	// 										'errType': 3
	// 									});
	// 			            		}
	// 			            		else if(newBookProp){
	// 			            			console.log('[Add a bookProp]Insert bookprop Successfull');
	// 			            			res.json({
	// 										'errType': 0
	// 									});
	// 			            		}else{
	// 			            			console.log('[Add a bookProp]Insert bookprop Fail');
	// 			            			res.json({
	// 										'errType': 3
	// 									});
	// 			            		}

	// 			            	});
	// 			            }
	// 	            	});
	// 	            }

	//         	});
	//         }

	// 	});


	// });// add one book

	app.post('/admin/books/:intrID', function(req, res){
		var flag = true;
		var intrID = req.params.intrID;
		var db = req.app.get('db');
		// console.log(req.body);
		var param = req.body;
		var json;
		// status: param.status==0?param.status:0, //0-free,1-reserved,2-borrowed
		var newBook = {
			unqId: param.unqId,
			isbn: param.isbn,
			status: 0,
			name: param.name,
			__v: 0,
			owner:param.owner,
			intrID: param.intrID,
			borrower:[]
		};	
		db.get(database.listsDb, function(err, books){
			if(err)
			{
				console.log('[Add a book]DB find a book err : '+ err);
			}
			else{
				for(var i = 0; i < books.data.length ; i++)
				{
					if(books.data[i].unqId == newBook.unqId)
					{
						flag = false;
						console.log('[Add a book]This book exists');
						res.json({
			              'errType': 1
			            });
						break;
					}
				}
				//if flag is true means not exist ,so you need to add this record
				if(flag)
				{
					console.log('[Add a bookProp]Insert book Successfull');
					books.data.push(newBook);
					db.insert(books,function(err, data){
						if (err) {
							res.json({err:err});
							return;
						}
					});
					db.get(database.detailsDb,function(err,booksprop){
						if(err)
						{
							console.log('[Add a book]DB find a book err : '+ err);
						}
						else{
							var amdfBook = {
											unqId: param.unqId,
											isbn: param.isbn,
											name: param.name,
											category: param.category,
											desc: param.desc,
											publisher: param.publisher,
											author: param.author,
											pageCount: param.pageCount,
											price: param.price,
											count: 1,
											image: param.image,
											likes:[],
											rates:[],
											comments:[],
											owner:param.owner
										   };
							console.log('[Add a bookProp]Insert bookprop Successfull');			   
							booksprop.data.push(amdfBook);
							db.insert(booksprop,function(err, data){
								if (err) {
									res.json({err:err});
									return;
								}
							});
							json = {
		                      intrID:intrID,
		                      time: new Date(),
		                      action:"Add",
		                      what:amdfBook
		                    };
	                        log_operate(res,db,database.logDb,json);
							res.json({
										'errType': 0
									});
						}
					});
				}	
		    }
		});    
	});// add one book

	// app.delete('/admin/book/:unqId', filter.adminAuthorize, function(req, res){
	// 	//console.log(req.params);
	// 	var delunqID = req.params.unqId;
	// 	Book.findOne({
	// 		unqId : delunqID
	// 	}, function(err, book){
	// 		if(err) {
	//           console.log('[Delete a book]DB find a book err : '+ err);
	//           res.json({
	//             'errType': 3
	//           });
	//         }
	//         else if(!book){
	// 			console.log('[Delete a book]No this book');
	// 			res.json({
	// 			'errType': 1
	// 			});
	//         }else{
	// 			var hisbook = {
	// 				unqId: book.unqId,
	// 				isbn: book.isbn,
	// 				name: book.name,
	// 				delTime: new Date(),
	// 				borrower : book.borrower
	// 			};
 //            	Book.remove({unqId: book.unqId}, function(err, delBook){
	// 				if(err) {
	// 		          console.log('[Delete a book]DB delete a book err : '+ err);
	// 		          res.json({
	// 		            'errType': 3
	// 		          });
	// 		        }else if(delBook){
	// 					BookProp.findOne({
	// 	            		isbn: book.isbn
	// 	            	}, function(err, bookprop){
	// 	            		if(err) {
	// 							console.log('[Delete a book]Find isbn err : '+ err);
	// 			            }
	// 			            else if(bookprop){
	// 			            	BookProp.update({isbn: bookprop.isbn},{count: bookprop.count-1}, function(err, mbookprop){
	// 			            		if(err){
	// 			            			console.log('[Update bookProp count]update bookprop count err : ' + err);
	// 			            		}
	// 			            		else if(mbookprop.nModified){
	// 			            			console.log('[Update bookProp count]update bookprop count Successfull');
	// 			            			History.findOne({unqId: book.unqId}, function(err, hbook){
	// 						        		if(err) {
	// 											console.log('[Find History]DB insert book err : '+ err);
	// 							            }else if(!hbook){
	// 							            	History.create(hisbook, function(err, newhbook){
	// 								        		if(err) {
	// 													console.log('[Insert History]DB insert book err : '+ err);
	// 									            }
	// 									            else if(!newbook){
	// 									            	console.log('[Insert History]DB insert book Fail');
	// 									            }else{
	// 									            	console.log('[Insert History]DB insert book Successfull');
	// 									            }
	// 								        	});
	// 							            }else{}
	// 						        	});
	// 			            			res.json({
	// 			            				errType: 0
	// 			            			});
	// 			            		}else{
	// 			            			console.log('[Update bookProp count] No update for bookprop');
	// 			            		}
	// 			            	});
	// 			            }
	// 			        });
	// 		        }else{
	// 		        	console.log("[Delete book Fail]");
	// 		        	// console.log(delBook);
	// 		        }
 //            	});
	//         }
	//     });
	// });// delete one book

    
	
	app.get('/admin/book/:unqId/:intrID',function(req, res){	
	// console.log(req.params.unqId);
	var what_book;
	var json;
	var flag = true;
	var operation = false;
	var book_correct = false;
	var bookprop_correct = false;
	var BOOK = {};
	var BOOKPROP = {};
	var delunqID = req.params.unqId;
	var admin_name_delete = req.params.intrID;
	var db = req.app.get('db');
	db.get(database.listsDb,function(err,books){
		if(err) {
          console.log('[Delete a book]DB find a book err : '+ err);
          res.json({
            'errType': 3
          });
        }
        else{
        	for(var i = 0 ; i < books.data.length ; i++)
        	{
        		if(books.data[i].unqId == delunqID)
        		{
        			what_book = books.data[i];
        			flag = false;
        			operation = true;
        			BOOK = books;
        			books.data.splice(i,1);
        			BOOK.data = books.data;
        			break;
        			
        		}
        	}
        	if(flag)
        	{
        		console.log('[Delete a book]No this book');
				res.json({
				'errType': 1
				});
        	}
        	if(operation)
        	{
        		console.log(BOOK);
        		db.insert(BOOK,function(err,data){
        				if(err)
        				{
        					console.log('[Update book count]update book count err : ' + err);
        					res.json({
							   'errType': 3
							});
        				}
        			});
        			db.get(database.detailsDb,function(err,bookprop){
        				if(err) {
				          console.log('[Delete a book]DB find a bookprop err : '+ err);
				          res.json({
				            'errType': 3
				          });
				        }
				        else{
				        	for(var i=0;i<bookprop.data.length;i++)
				        	{	
				        		if(bookprop.data[i].unqId == delunqID)
				        		{
				        			BOOKPROP = bookprop;
				        			bookprop.data.splice(i,1);
				        			BOOKPROP.data = bookprop.data;
				        			// console.log(BOOKPROP);
				        			db.insert(BOOKPROP,function(err,data){
				        				if(err)
				        				{
				        					console.log('[Update bookProp count]update bookprop count err : ' + err);
				        					res.json({
								               'errType': 3
								            });
				        				}
				        				else{
			        					  	console.log('[Insert History]DB updata book Successfull');
			        					  	if(admin_name_delete)
			        					  	{
			        					  		console.log(admin_name_delete);
			        					  		json = {
							                      intrID:admin_name_delete,
							                      time: new Date(),
							                      action:"Delete",
							                      what:what_book
							                    };
						                      log_operate(res,db,database.logDb,json);
			        					  	}			        					  	
							        		res.json({
							    				errType: 0
							    			});
				        				}
				        			});
				        		}
				        	}
				        }

        			});
        	}
        }
	});
});


	// app.put('/admin/book/unqId', filter.adminAuthorize, function(req, res){
	// 	// console.log(req.body);
	// 	var param = req.body;
	// 	var mdfBook = {
	// 		name: param.name,
	// 		image: param.image,
	// 		category: param.category,
	// 		author: param.author,
	// 		publisher: param.publisher,
	// 		pageCount: param.pageCount,
	// 		price: param.price,
	// 		desc: param.desc
	// 	}
	// 	// console.log(mdfBook);

	// 	BookProp.update({isbn: param.isbn}, mdfBook, function(err, bookprop4){
	// 		if(err) {
	//           console.log('[update bookprop info]update book info err : '+ err);
	//           res.json({
	//             'errType': 3
	//           });
	//         }
	//         else if(bookprop4.ok || bookprop4.nModified){
	// 			console.log(bookprop4.nModified);
	// 			Book.update({isbn: param.isbn},{name: mdfBook.name}, function(err, book1){
	// 				if(err){
	// 					console.log('[update book info]update book name err : '+ err);
	// 				}
	// 				else if(book1.ok || book1.nModified){
	// 					console.log('[update book info]update book Successfull');
	// 					res.json({
	// 					'errType': 0
	// 					});
	// 				}else{
	// 					console.log('[update book name]update book name Fail');
	// 				}
	// 			});
	//         }else{
	//         	console.log('[update book info]update book Fail');
	// 			res.json({
	// 			'errType': 3
	// 			});
	//         }
	// 	});


	// });//modify one book
	app.put('/admin/book/unqId/:save_name',function(req,res){
    var flag = false;
    var db = req.app.get('db');
    var param = req.body;
    var Modify_book_info;
    var save_name = req.params.save_name;
    var mdfBook = {
        name: param.name,
        image: param.image,
        category: param.category,
        author: param.author,
        publisher: param.publisher,
        pageCount: param.pageCount,
        price: param.price,
        desc: param.desc
    }
    db.get(database.listsDb,function(err,books){
        if(err)
        {
            console.log('[update book info]find book info err : '+ err);
            res.json({
              'errType': 3
            });
        }
        else{
            for(var i=0;i<books.data.length;i++)
            {
                if(books.data[i].unqId == param.unqId)
                {
                    books.data[i].name = mdfBook.name;
                    db.insert(books,function(err,data){
                        if(err)
                        {
                            console.log('[update book info]update book info err : '+ err);
                            res.json({
                              'errType': 3
                            }); 
                        }else{
                             db.get(database.detailsDb,function(err,bookprops){
					            if(err)
					            {
					                console.log('[update book info]find book info err : '+ err);
					                res.json({
					                  'errType': 3
					                });
					            }
					            else{
					                for(var j = 0 ; j < bookprops.data.length ; j++)
					                {
					                    if(bookprops.data[j].unqId == param.unqId)
					                    {
					                        bookprops.data[j].name = param.name;
					                        bookprops.data[j].image = param.image;
					                        bookprops.data[j].category = param.category;
					                        bookprops.data[j].author = param.author;
					                        bookprops.data[j].publisher = param.publisher;
					                        bookprops.data[j].pageCount = param.pageCount;
					                        bookprops.data[j].price = param.price;
					                        bookprops.data[j].desc = param.desc;

					                        Modify_book_info = bookprops.data[j];

					                        db.insert(bookprops,function(err,data){
					                            if(err)
					                            {
					                                console.log('[update book info]update book info err : '+ err);
					                                res.json({
					                                  'errType': 3
					                                }); 
					                            }else{
					                                console.log('[update book info]update book Successfull');
					                                
					                                json = {
						                              intrID:save_name,
						                              time: new Date(),
						                              action:"Modify",
						                              what:Modify_book_info
						                            };
						                            log_operate(res,db,database.logDb,json);

					                                res.json({
					                                'errType': 0
					                                });
					                            }
					                        });
					                        break;
					                    }
					                }
					            }
					        });
                        }
                    });
                    break;
                }
            }
        }
    });
});
};
