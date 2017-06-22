var Book = require('../models/Book.js');

//dff19930703
exports.admin = {
  id: 'libadmin@cn.ibm.com',
  pwd: 'libadmin'
};
exports.authorize = function(req, res, next) {
  if (!req.session.user_id) {
    res.status(401).send('User');
  } else {
    next();
  }
};

exports.adminAuthorize = function(req, res, next) {
  // if (!req.session.adminUserID || req.session.adminUserID != exports.admin.id) {
  //   res.status(401).send('Admin');
  // } else {
    next();
  // }
};

exports.cancelExpiredBook = function(unqId,req,res) {
  var db = req.app.get('db');
  console.log('cancelExpiredBook unqId:', unqId);

  db.get("1",function(err,books){
    if(err)
    {
      console.log('cancelExpiredBook err:', err, books);
    }
    else{
      for(var j = 0 ; j < books.data.length ; j++)
      {
        if(books.data[j].unqId == unqId)
        {
          books.data[j].status = 0;
          books.data[j].intrID = "";
          books.data[j].applyTime = null;
          books.data[j].borrowTime = null;
          books.data[j].returnTime = null;
          db.insert(books,function(err,data){
            if(err)
            {
              console.log('insert err:', err,books);
            }
          });
          break;
        }
      } 
    }
  });
  // Book.findByIdAndUpdate({
  //   _id: _id
  // }, {
  //   status: 0,
  //   $unset: {
  //     intrID: '',
  //     applyTime: null,
  //     borrowTime: null,
  //     returnTime: null
  //   }
  // }, function(err, book){
  //   console.log('cancelExpiredBook err:', err, book);
  // });
};

