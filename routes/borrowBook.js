var User = require('../models/User.js');
var Book = require('../models/Book.js');
var BookProp = require('../models/BookProp.js');
var filter = require('../models/Filter.js');
var database = require("./database_setting.js");

module.exports = function(app) {
  app.put('/book/:isbn/borrow', filter.authorize, function(req, res) {
    var count = 0;
    var db = req.app.get('db');
    var intrID = req.body.intrID;
    var flag = true;
    var result = {};
    var flag_db = true;
    // console.log(intrID);
    // res.send(intrID);
    
    db.get(database.listsDb,function(err,books){
      if(err)
      {
        console.log('[Find book] Find book DB err : ' + err);
      }
      else 
      {
        for(var i = 0 ; i < books.data.length ; i++)
        { 
          if(books.data[i].intrID == intrID)
          {
            count++;
            if(count>=2)
            {
              flag_db = false;
              res.send({
                errType:1
              });
             break;
            }
          }
        }

        if(flag_db){db.get(database.listsDb,function(err,book){
          if(err)
          {
            console.log('[Find book] Find book DB err : ' + err);
          }
          else{
            for(var i = 0 ; i < book.data.length ; i++)
            {
              if( (book.data[i].isbn == req.params.isbn) && book.data[i].status==0)
              {
                flag = true;
                var applyTime = Date();
                book.data[i].status = 1;
                book.data[i].intrID = intrID;
                book.data[i].applyTime = applyTime;
                result = book;
                break;
                // res.send("successfully get here");
              }
              
            }
            if(flag)
            {
              db.insert(book,function(err,data){
                if(err)
                {
                  console.log('[Update book status and time] Update book DB err : ' + err);
                }
                else{
                  res.send({
                    errType: 0,
                    applyTime: applyTime
                  });
                }
              });
            }
            else{
              console.log('[Find available book]No available book');
              res.send({
                errType:2
              });
            }
            
          }
        })};
      }
    });
  }); //apply one book
//, filter.adminAuthorize
  app.get('/admin/events', function(req, res) {
    // res.send("hahahahaha");
    var db = req.app.get('db');
    db.get(database.listsDb,function(err,books){
      if(err)
      {
        console.log('[Find applied books] Find books DB err : ' + err);
      }
      else{
        var eventBooks = [];
        for(var i = 0 ; i < books.data.length ; i++)
        {
          if(books.data[i].status == 2 || books.data[i].status == 1 && new Date(books.data[i].applyTime) > new Date(new Date().valueOf() - 2 * 24 * 60 * 60 * 1000))
          {
            // && books.data[i].applyTime > new Date(new Date().valueOf() - 2 * 24 * 60 * 60 * 1000)
            //console.log(new Date(books.data[i].applyTime) > new Date(new Date().valueOf() - 2 * 24 * 60 * 60 * 1000));
            //console.log(new Date(new Date().valueOf() - 2 * 24 * 60 * 60 * 1000));
            eventBooks.push(books.data[i]);
            continue;
          }
          else if(books.data[i].status == 1 && new Date(books.data[i].applyTime) < new Date(new Date().valueOf() - 2 * 24 * 60 * 60 * 1000))
          {
            // filter.cancelExpiredBook(books.data[i].unqId , req , res);
          }
          
        }
        console.log('[Find applied books] Find all reserved books Successful');
        res.json(eventBooks);
      }
    });

    // Book.find({
    //   status: {
    //     '$in': [1, 2]
    //   }
    // }, function(err, books) {
    //   if (err) {
    //     console.log('[Find applied books] Find books DB err : ' + err);
    //   } else {
    //     var eventBooks = [];
    //     for (var i in books) {
    //       if (books[i].status == 1 && books[i].applyTime < new Date(new Date().valueOf() - 2 * 24 * 60 * 60 * 1000)) {
    //         filter.cancelExpiredBook(books[i]._id);
    //         books[i].status = 0;
    //         delete books[i].applyTime;
    //         delete books[i].intrID;
    //         continue;
    //       };
    //       eventBooks.push(books[i]);
    //     };
    //     console.log('[Find applied books] Find all reserved books Successful');
    //     res.json(eventBooks);
    //   }
    // }).sort({
    //   applyTime: -1
    // });
    
  }); //apply books list


// , filter.adminAuthorize
  app.put('/admin/events/:unqId', filter.adminAuthorize, function(req, res) {
    var unqId = req.params.unqId;
    var intrID = req.body.intrId;
    var db = req.app.get('db');
    var flag = false;
    // var addborrower = {};
    var Uname;
    var UintrID;
    db.get(database.listsDb,function(err,resbooks){
            if(err)
            {
                console.log('[Borrow a book] Find the reserved book DB err : ' + err);
            }
            else{

                for(var i = 0 ; i < resbooks.data.length ; i++)
                {
                    if(resbooks.data[i].unqId == unqId)
                    {

                        if(getExpireTime(resbooks.data[i].applyTime,2) < new Date())
                        {
                            console.log('[Borrow a book] The book has expired');
                        }
                        else{
                          console.log("successfully");
                          db.get("3",function(err,users){
                            if(err)
                            {
                              console.log('[User borrowed Books] This user borrowed books DB err : ' + err);
                            }
                            else{
                              for(var j = 0 ; j < users.data.length ; j++)
                              {
                                if(users.data[j].intrID == intrID)
                                {
                                  addborrower = {
                                    intrID: users.data[j].intrID,
                                    name: users.data[j].name
                                  };
                                  // Uname = users.data[j].name;
                                  // UintrID = users.data[j].intrID;
                                  borrowedBook = {
                                    unqId: unqId,
                                    name: resbooks.data[i].name
                                  }
                                  if(users.data[j].borrowedBooks==undefined)
                                  {
                                    users.data[j].borrowedBooks = [];
                                  }
                                  if(resbooks.data[i].borrower==undefined)
                                  {
                                    resbooks.data[i].borrower = [];
                                  }
                                  console.log("1",addborrower);
                                  resbooks.data[i].borrower.push(addborrower);
                                  users.data[j].borrowedBooks.push(borrowedBook);             
                                  break;
                                }
                              }
                              db.insert(users,function(err,data){
                                if(err)
                                {
                                  console.log("update user err :" + err);
                                }
                                else{
                                  console.log("insert users success");
                                }
                              }); 
                            }

                            console.log("2",addborrower);
                            var bTime = new Date();
                            var rTime = getExpireTime(bTime, 30);  
                            resbooks.data[i].status = 2;
                            resbooks.data[i].borrowTime = bTime;
                            resbooks.data[i].returnTime = rTime;
                            resbooks.data[i].intrID = intrID;
                            db.insert(resbooks,function(err,data){
                              if(err)
                              {
                                console.log("update book err :"+err);
                              }
                              else{
                                console.log('[Borrow a book] Upate book status and time Successful');
                                res.json({
                                  errType: 0,
                                  borrowTime: bTime,
                                  returnTime: rTime
                                });
                              }
                            }); 

                          });
                        }//else end
                        break;
                    }
                   
                } 
            }
        });
    // Book.findOne({
    //   unqId: unqId
    // }, function(err, resbook) {
    //   if (err) {
    //     console.log('[Borrow a book] Find the reserved book DB err : ' + err);
    //   } else if (getExpireTime(resbook.applyTime, 2) < new Date()) {
    //     console.log('[Borrow a book] The book has expired');
    //   } else {
    //     User.findOne({
    //       intrID: intrID
    //     }, function(err, buser) {
    //       if (err) {
    //         console.log('[User borrowed Books] This user borrowed books DB err : ' + err);
    //       } else {
    //         var addborrower = {
    //           intrID: buser.intrID,
    //           name: buser.name
    //         };
    //         resbook.borrower.push(addborrower);
    //         var bTime = new Date();
    //         var rTime = getExpireTime(bTime, 30);
    //         Book.update({
    //           unqId: unqId
    //         }, {
    //           status: 2,
    //           borrowTime: bTime,
    //           returnTime: rTime,
    //           intrID: intrID,
    //           borrower: resbook.borrower
    //         }, function(err, bbook) {
    //           if (err) {
    //             console.log('[Borrow a book] Upate book status and time DB err : ' + err);
    //           } else if (!bbook.nModified) {
    //             console.log('[Borrow a book] Upate book status and time Fail');
    //           } else {
    //             var borrowbook = {
    //               unqId: unqId,
    //               name: resbook.name
    //             }
    //             buser.borrowedBooks.push(borrowbook);
    //             User.update({
    //               intrID: intrID
    //             }, {
    //               borrowedBooks: buser.borrowedBooks
    //             }, function(err, addbook) {
    //               if (err) {
    //                 console.log('[User borrowed Books] Update user borrowed books DB err : ' + err);
    //               } else if (addbook.nModified) {
    //                 console.log('[User borrowed Books] Update user borrowed books Successful');
    //               } else {
    //                 console.log('[User borrowed Books] Update user borrowed books Fail');
    //               }
    //             });
    //             console.log('[Borrow a book] Upate book status and time Successful');
    //             res.json({
    //               errType: 0,
    //               borrowTime: bTime,
    //               returnTime: rTime
    //             });
    //           }
    //         });
    //       }
    //     });
    //   }
    // });
  }); //borrow one book


//, filter.adminAuthorize
  // app.post('/admin/events/:unqId', filter.adminAuthorize, function(req, res) {
  //   var unqId = req.params.unqId;
  //   // var intrID = req.body.intrId;

  //   Book.findOne({
  //     unqId: unqId
  //   }, function(err, resbook) {
  //     if (err) {
  //       console.log('[Return a book] Find the reserved book DB err : ' + err);
  //     } else {
  //       User.findOne({
  //         intrID: resbook.intrID
  //       }, function(err, buser) {
  //         if (err) {
  //           console.log('[User Returned Books] This user borrowed books DB err : ' + err);
  //         } else {
  //           Book.update({
  //             unqId: unqId
  //           }, {
  //             status: 0,
  //             $unset: {
  //               intrID: '',
  //               applyTime: null,
  //               borrowTime: null,
  //               returnTime: null
  //             }
  //           }, function(err, bbook) {
  //             if (err) {
  //               console.log('[Return a book] Upate book status and time DB err : ' + err);
  //             } else if (!bbook.nModified) {
  //               console.log('[Return a book] Upate book status and time Fail');
  //             } else {
  //               var borrowedbooks = [];
  //               for (var i = buser.borrowedBooks.length - 1; i >= 0; i--) {
  //                 if (buser.borrowedBooks[i].unqId == unqId) {
  //                   // delete buser.borrowedBooks[i];
  //                 } else {
  //                   borrowedbooks.push(buser.borrowedBooks[i]);
  //                 }
  //               };
  //               User.update({
  //                 intrID: resbook.intrID
  //               }, {
  //                 borrowedBooks: borrowedbooks
  //               }, function(err, addbook) {
  //                 if (err) {
  //                   console.log('[User Returned Books] Update user borrowed books DB err : ' + err);
  //                 } else if (addbook.nModified) {
  //                   console.log('[User Returned Books] Update user borrowed books Successful');
  //                 } else {
  //                   console.log('[User Returned Books] Update user borrowed books Fail');
  //                 }
  //               });
  //               console.log('[Return a book] Upate book status and time Successful');
  //               res.json({
  //                 errType: 0
  //               });
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  // }); //return one book

  app.post('/admin/events/:unqId', filter.adminAuthorize, function(req, res) {
    var unqId = req.params.unqId;
    var db = req.app.get('db');
    // var intrID = req.body.intrId;

    db.get(database.listsDb,function(err,books){
        var intrID_buffer;
        if(err)
        {
          console.log('[Return a book] Find the reserved book DB err : ' + err);  
        }
        else{
          for(var i = 0 ; i < books.data.length ; i++)
          {
            if(books.data[i].unqId == unqId)
            {
              intrID_buffer = books.data[i].intrID;
              books.data[i].status = 0;
              books.data[i].intrID = "";
              books.data[i].applyTime=null;
              books.data[i].borrowTime=null;
              books.data[i].returnTime=null;
              
              // for(var j = 0 ; j < books.data[i].borrower.length ; j++)
              // {
              //   if(books.data[i].borrower[j].intrID == intrID_buffer)
              //   {
              //     books.data[i].borrower.splice(j,1);
              //     break;
              //   }
              // }
              
              db.insert(books,function(err,data){
                if(err)
                {
                  console.log('[Return a book] Upate book status and time DB err : ' + err);
                }
                else{
                  db.get(database.usersDb,function(err,users){
                    if(err)
                    {
                      console.log("find user err:"+err);
                    }
                    else{
                      console.log(intrID_buffer);
                      for(var n = 0 ; n < users.data.length ; n++)
                      {
                        console.log(users.data[n].intrID == intrID_buffer);
                        if(users.data[n].intrID == intrID_buffer)
                        {
                          for(var k = 0 ; k < users.data[n].borrowedBooks.length ; k++)
                          {

                            if(users.data[n].borrowedBooks[k].unqId == unqId)
                            {
                              users.data[n].borrowedBooks.splice(k,1);
                              break;
                            }
                          }
                          break;
                        }
                      }
                      db.insert(users,function(err,data){
                        if(err)
                        {
                          console.log('[User Returned Books] Update user borrowed books DB err : ' + err);
                        }
                        else{
                          res.json({
                            errType: 0
                          });
                        }
                      });
                    }
                  });
                }
              });
              break;
            } // if end
          } //for end 
        }//else end
    });//db.get("1") end 

    // Book.findOne({
    //   unqId: unqId
    // }, function(err, resbook) {
    //   if (err) {
    //     console.log('[Return a book] Find the reserved book DB err : ' + err);
    //   } else {
    //     User.findOne({
    //       intrID: resbook.intrID
    //     }, function(err, buser) {
    //       if (err) {
    //         console.log('[User Returned Books] This user borrowed books DB err : ' + err);
    //       } else {
    //         Book.update({
    //           unqId: unqId
    //         }, {
    //           status: 0,
    //           $unset: {
    //             intrID: '',
    //             applyTime: null,
    //             borrowTime: null,
    //             returnTime: null
    //           }
    //         }, function(err, bbook) {
    //           if (err) {
    //             console.log('[Return a book] Upate book status and time DB err : ' + err);
    //           } else if (!bbook.nModified) {
    //             console.log('[Return a book] Upate book status and time Fail');
    //           } else {
    //             var borrowedbooks = [];
    //             for (var i = buser.borrowedBooks.length - 1; i >= 0; i--) {
    //               if (buser.borrowedBooks[i].unqId == unqId) {
    //                 // delete buser.borrowedBooks[i];
    //               } else {
    //                 borrowedbooks.push(buser.borrowedBooks[i]);
    //               }
    //             };
    //             User.update({
    //               intrID: resbook.intrID
    //             }, {
    //               borrowedBooks: borrowedbooks
    //             }, function(err, addbook) {
    //               if (err) {
    //                 console.log('[User Returned Books] Update user borrowed books DB err : ' + err);
    //               } else if (addbook.nModified) {
    //                 console.log('[User Returned Books] Update user borrowed books Successful');
    //               } else {
    //                 console.log('[User Returned Books] Update user borrowed books Fail');
    //               }
    //             });
    //             console.log('[Return a book] Upate book status and time Successful');
    //             res.json({
    //               errType: 0
    //             });
    //           }
    //         });
    //       }
    //     });
    //   }
    // });
  }); //return one book

  app.get('/user/:intrID/borrowedbooks', function(req, res) {
    var intrID = req.params.intrID;
    User.findOne({
      intrID: intrID
    }, function(err, user) {
      res.json({
        books: user.borrowedBooks
      });
    });
  }); //I borrowed

  function getExpireTime(now, num) {
    // now.setFullYear();
    // now.setDate(now.getDate()+num);
    var expTime = new Date();
    expTime.setDate(new Date(now).getDate() + num);
    return expTime;
  };

  app.put('/book/:isbn/cancelBorrow', filter.authorize, function(req, res) {
    console.log('CancelBorrow start', req.body);
    var intrID = req.body.intrID;
    var isbn = req.params.isbn;
    Book.findOneAndUpdate({
      isbn: isbn,
      status: 1,
      intrID: intrID
    }, {
      status: 0,
      $unset: {
        intrID: '',
        applyTime: null
      }
    }, function(err, book) {
      if (err) {
        req.send({
          errType: 0
        });
      } else {
        console.log("[cancelBorrow]book =", book);
        res.send({
          errType: 0
        });
      };
    });
  });
};
