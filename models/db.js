
// var mongoose = require( 'mongoose' );
// var dbURI = 'mongodb://9.115.26.136/elevenlibrary_prod';

// mongoose.connect(dbURI);

// mongoose.connection.on('connected', function () {
//      console.log('Mongoose connected to ' + dbURI);
// });
// mongoose.connection.on('error',function (err) {
//       console.log('Mongoose connection error: ' + err);
// });
// mongoose.connection.on('disconnected', function () {
//       console.log('Mongoose disconnected');
// });
// process.on('SIGINT', function() {
//       mongoose.connection.close(function () {
//           console.log('Mongoose disconnected through app termination');
//           process.exit(0);
//        });
// });
 


/*
var db;

var cloudant;

var fileToUpload;

var dbCredentials = {
    dbName: 'my_sample_db'
};

function getDBCredentialsUrl(jsonData) {
    var vcapServices = JSON.parse(jsonData);
    // Pattern match to find the first instance of a Cloudant service in
    // VCAP_SERVICES. If you know your service key, you can access the
    // service credentials directly by using the vcapServices object.
    for (var vcapService in vcapServices) {
        if (vcapService.match(/cloudant/i)) {
            return vcapServices[vcapService][0].credentials.url;
        }
    }
}

function initDBConnection() {
    //When running on Bluemix, this variable will be set to a json object
    //containing all the service credentials of all the bound services
    if (process.env.VCAP_SERVICES) {
        dbCredentials.url = getDBCredentialsUrl(process.env.VCAP_SERVICES);
    } else { //When running locally, the VCAP_SERVICES will not be set

        // When running this app locally you can get your Cloudant credentials
        // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
        // Variables section for an app in the Bluemix console dashboard).
        // Once you have the credentials, paste them into a file called vcap-local.json.
        // Alternately you could point to a local database here instead of a
        // Bluemix service.
        // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
        dbCredentials.url = getDBCredentialsUrl(fs.readFileSync("vcap-local.json", "utf-8"));
    }

    cloudant = require('cloudant')(dbCredentials.url);

    // check if DB exists if not create
    cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
    });

    db = cloudant.use(dbCredentials.dbName);
}

*/

var Cloudant = require("cloudant");
var dbConfig = {
    account : '84314864-f8e8-4931-9454-17d35fa1071c-bluemix', 
    password : "32a5da510f3b0c4d37f87621242e1b7d43a39c2cd78603b3ce0e61520b512f24",
    dbName : "student",
    url:'https://84314864-f8e8-4931-9454-17d35fa1071c-bluemix:32a5da510f3b0c4d37f87621242e1b7d43a39c2cd78603b3ce0e61520b512f24@84314864-f8e8-4931-9454-17d35fa1071c-bluemix.cloudant.com'
};
var cloudant = Cloudant(dbConfig);
console.log(cloudant);
var db = cloudant.db.use(dbConfig.dbName);
// app.set("cloudant", cloudant);
// app.set("db", db);
module.exports = {"cloudant":cloudant,"db":db};