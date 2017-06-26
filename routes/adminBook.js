// var Book = require('../models/Book.js');
// var BookProp = require('../models/BookProp.js');
var History = require('../models/History.js');
var filter = require('../models/Filter.js');
var database = require("./database_setting.js");

// module.exports = function(app) {
//   app.get('/admin/books', filter.adminAuthorize, function(req, res) {
//     Book.find(function(err, books) {
//       if (err) {
//         console.log("[Query books] DB error !");
//         res.send(err);
//       } else {
//         BookProp.find(function(err, booksprop) {
//           if (err) {
//             console.log("[Query BookProp] DB error !");
//             res.send(err);
//           } else {

//             var newBooks = [];
//             for (var i = 0; i < books.length; i++) {
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
//             res.send(newBooks);
//           };
//         });
//       }; //booksprop
//     }); //books
//   }); // add one book

// };
// filter.adminAuthorize,

module.exports = function(app){
  app.get('/admin/books',  function(req, res){
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
          for (var i = 0; i < books.data.length; i++) {
            for (var j = 0; j < booksprop.data.length; j++) {
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
                if(booksprop.data[j].owner == undefined)
                {
                  booksprop.data[j].owner = "ibm";
                }
                book.owner = booksprop.data[j].owner;
                newBooks.push(book);
                break;
              };
            };
          };
          res.send(newBooks);
        };
      });
    }
   });
  });
}