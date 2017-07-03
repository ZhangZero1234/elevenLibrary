var User = require('../models/User.js'); //User mocule
var bluepage = require('ibm_bluepages');
var filter = require('../models/Filter.js');
var database = require("./database_setting.js");
var log_operate = require("./log_operation.js");
/*
 * GET users listing.
 */
// ,
    // {
    //   "intrID": "renfeid@cn.ibm.com",
    //   "name": "Ren Fei Dong",
    //   "pwd": "leoperd13",
    //   "phoneNum": ""
    // }
// exports.list = function(req, res){
//   res.send("respond with a resource");
// };
module.exports = function(app) {
  app.post('/adminLogin', function(req, res) {
    var phoneNum = '';
    var flag = true;
    var db = req.app.get("db");
    var intrID = req.body.intrID;
    var pwd = req.body.pwd;
    console.log("intrIDintrIDintrID:"+intrID);
    if (intrID && pwd) {
      if (filter.admin.id == intrID) {
        if (filter.admin.pwd == pwd) {
          req.session.adminUserID = filter.admin.id;
          console.log('[AdminLogin]Login Successfully');
          res.json({
            'errType': 0,
            'intrID':intrID
          });
        } else {
          console.log('[AdminLogin]Wrong Password');
          res.json({
            'errType': 2
          });
        }
      } else {
        // db.get(database.usersDb,function(err,users){
        //   if(err)
        //   {
        //     console.log('[AdminLogin]find intrID incorrect');
        //   }
        //   else{
        //     for(var i = 0; i < users.data.length;i++)
        //     {
        //       if(users.data[i].intrID == intrID)
        //       {
        //         flag = false;
        //         if(users.data[i].pwd == pwd)
        //         {
        //           console.log('[AdminLogin]Login Successfully');
        //           if(users.data[i].phoneNumber)
        //             phoneNum = users.data[i].phoneNumber;
                  

        //           res.json({
        //             'errType': 0,
        //             'intrID':intrID
        //           });
        //         }
        //         else{
        //           console.log('[AdminLogin]Wrong Password');
        //           res.json({
        //             'errType': 2
        //           });
        //         }
        //         break;
        //       }
             
        //     }
        //     if(flag)
        //     {
        //       console.log('[AdminLogin]intrID incorrect');
        //       res.json({
        //         'errType': 1
        //       });
        //     }
        //   }
        // });
    bluepage.authenticate(intrID, pwd, function(success) {
      if (success) {console.log("bluepage.authenticate Successfully.");
        bluepage.getPersonInfoByIntranetID(intrID, function(result) {
          if (result === 'error') {console.log("bluepage.getPersonInfoByIntranetID error!");
            res.send({
              errType: 1
            });
          } else {console.log("bluepage.getPersonInfoByIntranetID Successfully.");
            var phoneNum = result.userTelephonenumber.slice(result.userTelephonenumber.indexOf('-')).replace(/[\-]+/g, '');
            var newUser = {
              'intrID': intrID,
              'name': result.userName,
              'phoneNum': phoneNum
            };
            var profile = {
              intrID: intrID,
              pwd: pwd,
              name: result.userName
            };
            req.session.admin_id = intrID;
            // req.session.user = result.userName;
            console.log('GetNameByIntranetID', result);
            db.get(database.usersDb,function(err,users){
              if(err)
              {
                res.send({
                  errType: 1
                });
              }
              else{
                for(var i = 0 ; i < users.data.length ; i++)
                {
                  if(users.data[i].intrID == intrID)
                  {
                    res.json({
                      "errType": 0,
                      "intrID":intrID
                      // "name": result.userName,
                      // "phoneNum": phoneNum,
                      // "image": 'https://w3-connectionsapi.ibm.com/profiles/photo.do?email=' + intrID,
                    });
                    flag = false;
                    break;
                  }
                }
                if(flag)
                {
                  users.data.push({
                      "intrID":intrID,
                      "name":result.userName,
                      "pwd":pwd,
                      'phoneNum': phoneNum
                    });
                    db.insert(users,function(err,data){
                      if(err)
                      {
                        console.log("insert user err :"+err);
                        res.send({
                          errType: 1
                        });
                      }
                      else{
                        res.json({
                          "errType": 0,
                          "intrID":intrID
                          // name: result.userName,
                          // phoneNum: phoneNum,
                          // image: 'https://w3-connectionsapi.ibm.com/profiles/photo.do?email=' + intrID,
                        });
                      }
                    });
                }
              }
            });
            
          }
        });
      } else {console.log("bluepage.authenticate Failed!");
        res.send({
          errType: 1
        });
      };
    });
      }
    } else {
      console.log('[AdminLogin]intrID or pwd is null');
    }
  });


  app.post('/login', function(req, res) {
    User.findOne({
      'intrID': req.body.intrID
    }, function(err, user) {
      if (err) {
        console.log('[Login]DB err : ' + err);
        res.json({
          'errType': 3
        });
      } else if (user) {
        if (user.pwd == req.body.pwd) {
          console.log('[Login]Successfully' + user);
          req.session.user_id = req.body.intrID;
          var profile = {
            intrID: user.intrID,
            pwd: user.pwd,
            name: user.name
          };
          res.json({
            'errType': 0,
            'token': token,
            'name': profile.name
          });
        } else {
          console.log('[Login]Wrong Password');
          console.log("db_pwd =" + user.pwd + "   pwd =" + req.body.pwd);
          res.json({
            'errType': 2
          });
        }
      } else {
        console.log('[Login]No User found');
        res.json({
          'errType': 1
        });
      }
    });
  });

  app.post('/user/logOut', function(req, res){
    var db = req.app.get("db");
    var json;
    if(req.session.user_id)
    {
      console.log(req.session.user_id);
      json = {
              intrID:req.session.user_id,
              time: new Date(),
              action:"LoginOut"
            };
      log_operate(res,db,database.logDb,json);
    }
    req.session.destroy(function(err){
      // req.session.user_id = intrID;
      // req.session.user = result.userName;  
      res.send(err);
    });
  });

  app.post('/admin/logOut', function(req, res){
    req.session.destroy(function(err){
      res.send(err);
    });
  });


  app.post('/register',function(req, res){
    var flag = true;
    var db = req.app.get("db");
    var intrID = req.body.intrID;
    if (intrID) {
      intrID = intrID.replace(/(^\s+)|(\s+$)/g, '');
    }
    var newUser = {
      'intrID': intrID,
      'name': req.body.name,
      'pwd': req.body.pwd,
      'phoneNum': req.body.phoneNum
    };

    var validateEmail = /^\w{1,22}(@cn.ibm.com)$/;
    var validatePwd = /(?=^\S{6,22}$)(?!(^[a-zA-Z\`\~\!\@\#\$\%\^\&\*\;\:\'\"\,\<\.\>\-\_\=\+\(\)\[\]\{\}\?\/\\\|]*$))(?!(^[0-9\`\~\!\@\#\$\%\^\&\*\;\:\'\"\,\<\.\>\-\_\=\+\(\)\[\]\{\}\?\/\\\|]*$))/;
    var validatePhone = /^[0-9]{11}$/;

    var validateFail = '';

    if (validateEmail.test(newUser.intrID)) {
      // console.log('email pass');
    } else {
      validateFail += "e";
    }
    if (validatePwd.test(newUser.pwd)) {
      // console.log('password pass');
    } else {
      validateFail += "w";
    }
    if (newUser.phoneNum) {
      if (validatePhone.test(newUser.phoneNum)) {
        // console.log('phonenumber pass');
      } else {
        validateFail += "p";
      }
    }

    if(validateFail == '')
    {
      db.get(database.usersDb,function(err,register){
        if(err)
        {
          console.log('[Register]DB find uer err : ' + err);
          res.json({
            'errType': 3
          });
        }
        else{
          for(var i = 0 ; i < register.data.length ; i++)
          {
            if(register.data[i].intrID == intrID)
            {
              req.session.user_id = intrID;
              req.session.user = register.data[i].name;
              flag = false;
              console.log('[Register]User existed');
              res.json({
                'errType': 1
              }); 
              break;             
            }
          }
          register.data.push(newUser);
          if(flag){
            db.insert(register,function(){
            if(err)
            {
              console.log('[Register]DB insert uer err : ' + err);
              res.json({
                'errType': 3
              });
            }
            else{
              console.log('[Register]DB insert newuser Successful' + newUser);
              res.json({
                'errType': 0,
                'RegUser': newUser
              });
            }
          });
          }
          
        }
      })
    }
  });


  //  // app.post('/register', function(req, res) {
  //   var intrID = req.body.intrID;
  //   if (intrID) {
  //     intrID = intrID.replace(/(^\s+)|(\s+$)/g, '');
  //   }
  //   var newUser = {
  //     'intrID': intrID,
  //     'name': req.body.name,
  //     'pwd': req.body.pwd,
  //     'phoneNum': req.body.phoneNum
  //   };

  //   var validateEmail = /^\w{1,22}(@cn.ibm.com)$/;
  //   var validatePwd = /(?=^\S{6,22}$)(?!(^[a-zA-Z\`\~\!\@\#\$\%\^\&\*\;\:\'\"\,\<\.\>\-\_\=\+\(\)\[\]\{\}\?\/\\\|]*$))(?!(^[0-9\`\~\!\@\#\$\%\^\&\*\;\:\'\"\,\<\.\>\-\_\=\+\(\)\[\]\{\}\?\/\\\|]*$))/;
  //   var validatePhone = /^[0-9]{11}$/;

  //   var validateFail = '';

  //   if (validateEmail.test(newUser.intrID)) {
  //     // console.log('email pass');
  //   } else {
  //     validateFail += "e";
  //   }
  //   if (validatePwd.test(newUser.pwd)) {
  //     // console.log('password pass');
  //   } else {
  //     validateFail += "w";
  //   }
  //   if (newUser.phoneNum) {
  //     if (validatePhone.test(newUser.phoneNum)) {
  //       // console.log('phonenumber pass');
  //     } else {
  //       validateFail += "p";
  //     }
  //   }

  //   if (validateFail == '') {
  //     User.findOne({
  //       'intrID': req.body.intrID
  //     }, function(err, user) {
  //       if (err) {
  //         console.log('[Register]DB find uer err : ' + err);
  //         res.json({
  //           'errType': 3
  //         });
  //       } else if (!user) {
  //         User.create(newUser, function(err, newuser) {
  //           if (err) {
  //             console.log('[Register]DB insert uer err : ' + err);
  //             res.json({
  //               'errType': 3
  //             });
  //           } else if (newuser) {
  //             console.log('[Register]DB insert newuser Successful' + newuser);
  //             res.json({
  //               'errType': 0,
  //               'RegUser': newuser
  //             });
  //           } else {
  //             console.log('[Register]Failed');
  //             res.json({
  //               'errType': 3
  //             });
  //           }
  //         });
  //       } else {
  //         console.log('[Register]User existed');
  //         res.json({
  //           'errType': 1
  //         });
  //       }
  //     })
  //   } else {
  //     console.log('[Register]validateFail');
  //     res.json({
  //       'errType': 2
  //     });
  //   }
  // });
  app.post("/details/contact/info",function(req,res){
    var db = req.app.get("db");
    var unqId = req.body.unqId;
    var owner = '';
    db.get(database.listsDb,function(err,books){
      if(err)
      {
        console.log("open doc 1 error");
      }
      else{
        for(var i = 0; i < books.data.length ; i++)
        {
          if(books.data[i].unqId == unqId)
          {
            owner = books.data[i].owner;
            if(owner=='ibm')
            {
              res.send({
                errType:0,
                owner:owner
              });
              break;
            }
            else{
              db.get(database.usersDb,function(err,users){
                if(err)
                {
                  console.log("find user info error");
                }
                else{
                  for(var i = 0 ; i < users.data.length ; i++)
                  {
                    if(users.data[i].intrID == owner)
                    {
                      res.send({
                        errType:0,
                        owner:users.data[i].intrID,
                        name:users.data[i].name,
                        phone:users.data[i].phoneNum
                      });
                      break;
                    }
                  }
                }
              });
            }
          }
        }
       
      }
    });
  });


  // app.post('/intrIDLogin',function(req, res){
  //   var db = req.app.get("db");
  //   var intrID = req.body.intrID;
  //   var pwd = req.body.pwd;
  //   var flag = true;
  //   var phoneNum = '';

  //   db.get("3",function(err,user){
  //     if(err)
  //     {
  //       res.send({
  //         errType: 1
  //       });
  //     }
  //     else{
  //       for(var i = 0 ; i < user.data.length ; i++)
  //       {
  //         if(user.data[i].intrID == intrID)
  //         {
  //           if(user.data[i].pwd == pwd)
  //           { 
  //             req.session.user_id = intrID;
  //             req.session.user = user.data[i].name;
  //             flag = false;
  //             if(user.data[i].phoneNum)
  //             {
  //               phoneNum = user.data[i].phoneNum;
  //             }
  //             else{
  //               phoneNum = "";
  //             }
  //             res.send({
  //               errType: 0,
  //               name: user.data[i].name,
  //               phoneNum: phoneNum,
  //               image: 'https://w3-connectionsapi.ibm.com/profiles/photo.do?email=' + intrID,
  //             });
  //           }
  //           else{
  //             res.send({
  //               errType: 1
  //             });
  //           }
  //           break;
  //         }
  //       }
  //       if(flag)
  //       {
  //         res.send({
  //          errType: 1
  //         });
  //       }
  //     }
  //   })
  // });




  app.post('/intrIDLogin', function(req, res) {
    console.log(database);
    var db = req.app.get("db");
    var intrID = req.body.intrID;
    var pwd = req.body.pwd;
    var flag = true;
    var json;
    bluepage.authenticate(intrID, pwd, function(success) {
      if (success) {console.log("bluepage.authenticate Successfully.");
        bluepage.getPersonInfoByIntranetID(intrID, function(result) {
          if (result === 'error') {console.log("bluepage.getPersonInfoByIntranetID error!");
            res.send({
              errType: 1
            });
          } else {console.log("bluepage.getPersonInfoByIntranetID Successfully.");
            var phoneNum = result.userTelephonenumber.slice(result.userTelephonenumber.indexOf('-')).replace(/[\-]+/g, '');
            var newUser = {
              'intrID': intrID,
              'name': result.userName,
              'phoneNum': phoneNum
            };
            var profile = {
              intrID: intrID,
              pwd: pwd,
              name: result.userName
            };
            req.session.user_id = intrID;
            req.session.user = result.userName;
            console.log('GetNameByIntranetID', result);

            db.get(database.usersDb,function(err,users){
              if(err)
              {
                res.send({
                  errType: 1
                });
              }
              else{
                for(var i = 0 ; i < users.data.length ; i++)
                {
                  if(users.data[i].intrID == intrID)
                  {
                    json = {
                      intrID:intrID,
                      time: new Date(),
                      action:"Login"
                      };
                    log_operate(res,db,database.logDb,json);
                    res.send({
                      errType: 0,
                      name: result.userName,
                      phoneNum: phoneNum,
                      image: 'https://w3-connectionsapi.ibm.com/profiles/photo.do?email=' + intrID,
                    });
                    flag = false;
                    break;
                  }
                }
                if(flag)
                {
                  users.data.push({
                      "intrID":intrID,
                      "name":result.userName,
                      "pwd":pwd,
                      'phoneNum': phoneNum
                    });
                    db.insert(users,function(err,data){
                      if(err)
                      {
                        console.log("insert user err :"+err);
                        res.send({
                          errType: 1
                        });
                      }
                      else{
                          json = {
                            intrID:intrID,
                            time: new Date(),
                            action:"Login"
                        };
                        log_operate(res,db,database.logDb,json);
                        res.send({
                          errType: 0,
                          name: result.userName,
                          phoneNum: phoneNum,
                          image: 'https://w3-connectionsapi.ibm.com/profiles/photo.do?email=' + intrID,
                        });
                      }
                    });
                }
              }
            });
          }
        });
      } else {console.log("bluepage.authenticate Failed!");
        res.send({
          errType: 1
        });
      };
    });
  });


};
