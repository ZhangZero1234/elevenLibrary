// var Book = require('../models/Book.js');
// var BookProp = require('../models/BookProp.js');
var filter = require('../models/Filter.js');
// var fs = require("fs");
var database = require("./database_setting.js");

//   app.get('/books', function(req, res) {
//     Book.find(function(err, books) {
//       if (err) {
//         console.log("[Query books] DB error !");
//         res.send(err);
//       } else {
//         // **********************************************
//         // fs.appendFile('allBooks.json', books, function (err) {

//         //   if (err) throw err;

//         //   console.log('The "data to append" was appended to file!');

//         // });
//         // **********************************************
//         BookProp.find(function(err, booksprop) {
//           if (err) {
//             console.log("[Query BookProp] DB error !");
//             res.send(err);
//           } else {
            
//             var newBooks = [];
//             for (var i = 0; i < books.length; i++) {
//               if (books[i].status == 1 && books[i].applyTime < new Date(new Date().valueOf() - 2 * 24 * 60 * 60 * 1000)) {
//                 filter.cancelExpiredBook(books[i]._id);
//                 books[i].status = 0;
//                 books[i].intrID = '';
//                 delete books[i].applyTime;
//                 delete books[i].borrowTime;
//                 delete books[i].returnTime;
//               };
//               for (var j = 0; j < booksprop.length; j++) {
//                 if (books[i].isbn == booksprop[j].isbn) {
//                   var book = {};
//                   book.unqId = books[i].unqId;
//                   book.isbn = books[i].isbn;
//                   book.status = books[i].status;
//                   book.applyTime = books[i].applyTime;
//                   book.borrowTime = books[i].borrowTime;
//                   book.returnTime = books[i].returnTime;
//                   book.intrID = books[i].intrID;
//                   book.borrower = books[i].borrower;
//                   book.name = booksprop[j].name;
//                   book.category = booksprop[j].category;
//                   book.desc = booksprop[j].desc;
//                   book.publisher = booksprop[j].publisher;
//                   book.author = booksprop[j].author;
//                   book.pageCount = booksprop[j].pageCount;
//                   book.price = booksprop[j].price;
//                   book.count = booksprop[j].count;
//                   book.image = booksprop[j].image;
//                   book.likes = booksprop[j].likes;
//                   book.rates = booksprop[j].rates;
//                   book.comments = booksprop[j].comments;
//                   newBooks.push(book);
//                   break;
//                 };
//               };
//             };
//              res.send(newBooks);
//           };
//         });
//       };
//     });
//   });

  // Likes, Rates and Comments
  // app.put('/book/:isbn/like', filter.authorize, function(req, res) {
  //   var isbn = req.params.isbn;
  //   var intrID = req.body.intrID;
  //   var ifYou = req.body.ifYou;
  //   if (ifYou) {
  //     BookProp.findOneAndUpdate({
  //       isbn: isbn
  //     }, {
  //       $push: {
  //         likes: intrID
  //       }
  //     }, function(err, book) {
  //       BookProp.findById({
  //         _id: book._id
  //       }, function(err, book_new) {
  //         res.send(book_new.likes);
  //       });
  //     });
  //   } else {
  //     BookProp.findOneAndUpdate({
  //       isbn: isbn
  //     }, {
  //       $pull: {
  //         likes: intrID
  //       }
  //     }, function(err, book) {
  //       BookProp.findById({
  //         _id: book._id
  //       }, function(err, book_new) {
  //         res.send(book_new.likes);
  //       });
  //     });
  //   };
  // });
// module.exports = function(app) {
  
// };

//   app.put('/book/:isbn/rate', filter.authorize, function(req, res) {
//     var isbn = req.params.isbn;
//     var intrID = req.body.intrID;
//     var value = req.body.value;
//     BookProp.findOneAndUpdate({
//       isbn: isbn
//     }, {
//       $push: {
//         rates: {
//           intrID: intrID,
//           value: value
//         }
//       }
//     }, function(err, book) {
//       BookProp.findById({
//         _id: book._id
//       }, function(err, book_new) {
//         res.send(book_new.rates);
//       });
//     })
//   });

//   app.put('/book/:isbn/comment', filter.authorize, function(req, res) {
//     var isbn = req.params.isbn;
//     var intrID = req.body.intrID;
//     var content = req.body.content;
//     BookProp.update({
//       isbn: isbn
//     }, {
//       $push: {
//         comments: {
//           intrID: intrID,
//           content: content,
//           time: Date.now()
//         }
//       }
//     }, function(err, book) {
//       if (err) {
//         console.log(err);
//         res.send(err);
//       } else {
//         BookProp.findOne({
//           isbn: isbn
//         }, function(err, book_new) {
//           if (err) {
//             console.log(err);
//             res.send(err);
//           } else {
//             res.send(book_new.comments);
//           }
//         });
//       }
//     })
//   });
  
    


//   app.delete('/book/:isbn/comment/:id', filter.authorize, function(req, res) {
//     var isbn = req.params.isbn;
//     var id = req.params.id;
//     console.log('id=', id);
//     BookProp.update({
//       isbn: isbn,
//       count: {
//         $ne: 0
//       }
//     }, {
//       $pull: {
//         comments: {
//           _id: id
//         }
//       }
//     }, function(err, book) {
//       if (err) {
//         console.log(err);
//         res.send(err);
//       } else {
//         BookProp.findOne({
//           isbn: isbn,
//           count: {
//             $ne: 0
//           }
//         }, function(err, newBook) {
//           if (err) {
//             console.log(err);
//             res.send(err);
//           } else {
//             console.log(newBook.comments);
//             res.send(newBook.comments);
//           }
//         })
//       }
//     });
//   })
  

//   // GetSimilarBooks
//   app.get('/book/:isbn/similar', function(req, res) {
//     var isbn = req.params.isbn;
//     BookProp.findOne({
//       isbn: isbn
//     }, function(err, book) {
//       if (err) {
//         res.send(err);
//       } else {
//         var category = book.category;
//         var simBooks = [];
//         BookProp.find({
//           category: category,
//           isbn: {
//             $ne: isbn
//           },
//           count: {
//             $ne: 0
//           },
//         }, null, {
//           limit: 4
//         }, function(err, books) {
//           for (var index in books) {
//             simBooks.push(books[index]);
//           };
//           res.send(simBooks);
//         });
//       }
//     });
//   });


 
  module.exports = function(app){
    app.get('/books', function(req, res){
      var db = req.app.get('db');
      //get Books database
      db.get(database.listsDb, function(err, books) {
      if (err) {
        res.json({err:err});
        return;
      }
      else{
        db.get(database.detailsDb,function(err, booksprop){
          if (err) {
            res.json({err:err});
            return;
          }
          else{
            var newBooks = [];
            var i,j;
            var lengthBooks = books.data.length;
            var lengthPro = booksprop.data.length;
            for (i = 0; i < lengthBooks; i++) {
              for (j = 0; j < lengthPro; j++) {
                if (books.data[i].unqId == booksprop.data[j].unqId) {
                  var book = {};
                  book.unqId = books.data[i].unqId;
                  book.isbn = books.data[i].isbn;
                  book.status = books.data[i].status;
                  book.applyTime = books.data[i].applyTime;
                  book.borrowTime = books.data[i].borrowTime;
                  book.returnTime = books.data[i].returnTime;
                  book.intrID = books.data[i].intrID;
                  book.borrower = books.data[i].borrower;
                  book.name = booksprop.data[j].name;
                  book.category = booksprop.data[j].category;
                  book.desc = booksprop.data[j].desc;
                  book.publisher = booksprop.data[j].publisher;
                  book.author = booksprop.data[j].author;
                  book.pageCount = booksprop.data[j].pageCount;
                  book.price = booksprop.data[j].price;
                  book.count = booksprop.data[j].count;
                  book.image = booksprop.data[j].image;
                  book.likes = booksprop.data[j].likes;
                  book.rates = booksprop.data[j].rates;
                  book.comments = booksprop.data[j].comments;
                  newBooks.push(book);
                  break;
                };
              };
            };
            res.send(newBooks);
          };
        });
        // res.send();
      }
     });
    });

    // Likes, Rates and Comments
    app.put('/book/:unqId/like', filter.authorize , function(req,res){
      var db = req.app.get('db');
      var unqId = req.params.unqId;
      var intrID = req.body.intrID;
      var ifYou = req.body.ifYou;
      // console.log(isbn);
      var buffer_like = [];
      var buffer_unlike = [];
      if(ifYou)
      {
        db.get(database.detailsDb,function(err,booksprop){
          if(err)
          {
            console.log("read booksprop err:"+err);
          }
          else{
            for(var i = 0 ; i < booksprop.data.length ; i++)
            {
              if(booksprop.data[i].unqId == unqId)
              {
                booksprop.data[i].likes.push(intrID);
                buffer_like = booksprop.data[i].likes;
                // res.send(booksprop.data[i].likes);
                db.insert(booksprop,function(err,data){
                  if(err)
                  {
                    console.log("insert like err:"+err);
                  }
                  else{
                    res.send(buffer_like);
                  }
                });
                break;
              }
              
            }
          }
        }); 
      }
      else{
        db.get(database.detailsDb,function(err,booksprop){
          if(err)
          {
            console.log("read booksprop err:"+err);
          }
          else{
            for(var n = 0 ; n < booksprop.data.length ; n++)
            {

              if(booksprop.data[n].unqId == unqId)
              {
                for(var m = 0 ; m < booksprop.data[n].likes.length ; m++)
                {
                  if(booksprop.data[n].likes[m] == intrID)
                  {
                    booksprop.data[n].likes.splice(m,1);
                    buffer_unlike = booksprop.data[n].likes;
                    db.insert(booksprop,function(err,data){
                      if(err)
                      {
                        console.log("insert like err:"+err);
                      }
                      else{
                        res.send(buffer_unlike);
                      }
                    });
                    break;
                  }
                }
                break;
              }
            }
          }
        });
      }
    });

    app.put('/book/:unqId/comment', filter.authorize,function(req,res){
        var comments = [];
        var db = req.app.get("db");
        var unqId = req.params.unqId;
        var intrID = req.body.intrID;
        var content = req.body.content;
        db.get(database.detailsDb,function(err,booksprop){
          if(err)
          {
            console.log(err);
            res.send(err);
          }
          else{
            for(var i = 0 ; i < booksprop.data.length ; i++)
            {
              if(booksprop.data[i].unqId == unqId)
              {
                booksprop.data[i].comments.push({
                  _id:Date.now().toString()+parseInt(Math.random()*10000),
                  intrID: intrID,
                  content: content,
                  time: new Date()
                });
                comments = booksprop.data[i].comments;
                db.insert(booksprop,function(err,data){
                  if(err)
                  {
                    console.log(err);
                    res.send(err);
                  }
                  else{
                    res.send(comments);
                  }
                });
                break;
              }
            }
          }
        });
      });

    app.delete('/book/:unqId/comment/:id', filter.authorize,function(req,res){
      var db = req.app.get("db");
      var unqId = req.params.unqId;
      var id = req.params.id;
      var conments_new = [];
      // console.log(id);
      db.get(database.detailsDb,function(err,booksprop){
        if(err)
        { 
          console.log(err);
          res.send(err);
        }
        else{
          for(var i = 0 ; i < booksprop.data.length ; i++)
          {
            if(booksprop.data[i].unqId==unqId)
            {
              for(var j = 0 ; j < booksprop.data[i].comments.length ; j++)
              {
                if(booksprop.data[i].comments[j]._id == id)
                {
                  booksprop.data[i].comments.splice(j,1);
                  conments_new = booksprop.data[i].comments;
                  break;
                }
              }
              db.insert(booksprop,function(err,data){
                if(err)
                {
                  console.log(err);
                  res.send(err);
                }
                else{
                  res.send(conments_new);
                }
              });
              break;
            }
          }
        }
      });
    });

    app.put('/book/:unqId/rate', filter.authorize,function(req,res){
      var my_rate = [];
      var flag = true;
      var db = req.app.get("db");
      var unqId = req.params.unqId;
      var intrID = req.body.intrID;
      var value = req.body.value;
      // console.log("isbn:"+isbn,"intrID:"+intrID,"value:"+value);
      db.get(database.detailsDb,function(err,booksprop){
        if(err)
        {
          console.log(err);
          res.send(err);
        }
        else{
          for(var i = 0 ; i < booksprop.data.length ; i++)
          {
            if(booksprop.data[i].unqId == unqId)
            {
              for(var j = 0 ; j < booksprop.data[i].rates.length ; j++)
              {
                if(booksprop.data[i].rates[j].intrID == intrID)
                {
                  booksprop.data[i].rates[j].value = value;
                  my_rate = booksprop.data[i].rates;
                  flag = false;
                  break;
                }
              }
              if(flag)
              { 
                booksprop.data[i].rates.push({
                  value:value,
                  intrID:intrID,
                  _id:Date.now().toString()+parseInt(Math.random()*10000)
                });
                my_rate = booksprop.data[i].rates;
              }
              db.insert(booksprop,function(err,data){
                if(err)
                {
                  console.log(err);
                  res.send(err);
                }
                else{
                  res.send(my_rate);
                }
              });
              break;
            }
          }
        }
      });
    });

  }
