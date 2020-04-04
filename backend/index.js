const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

var server = app.listen(port);

var io = require("socket.io").listen(server);
const keygenerator = require("keygenerator");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

app.use(helmet());
app.use(morgan("common"));
var wod ={};
const assert = require("assert");

// const { MongoClient } = require("mongodb");
var mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient
const Request = require("request");
var nodemailer = require('nodemailer');

const secret = require('./secret.js')


var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: secret.senderemail,
    pass: secret.senderpass
  }
});



function sendAthEmail(to, message,code){
  var mailOptions = {
    from: secret.senderemail,
    to: to,
    subject: `Code: ${code}`,
    text: message
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}




//const url = "mongodb://127.0.0.1:27017";


const url = secret.mongodburl; 

const dbName = "Personal-Website";


const collname = "Note"

;

app.options("*", cors()); // include before other routes
app.get("/products/:id", cors(), function(req, res, next) {
  res.json({ msg: "This is CORS-enabled for a Single Route" });
});
app.head("/getres", cors(), (req, res) => {
  console.info("HEAD /simple-cors");
  res.sendStatus(204);
});
app.get("/ggetres", cors(), (req, res) => {
  console.info("GET /simple-cors");
  res.json({
    text: "Simple CORS requests are working. [GET]"
  });
});
app.post("/getres", cors(), (req, res) => {
  console.info("POST /simple-cors");
  res.json({
    text: "Simple CORS requests are working. [POST]"
  });
});

app.get("/", (req, res) => {});





MongoClient.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    assert.equal(null, err);

    

    // Storing a reference to the database so you can use it later
    var db = client.db(dbName);


    console.log(`Connected MongoDB: ${url}`);
    console.log(`Database: ${dbName}`);
    ///mongo tasks

    async function addnote(name, strnote,collectionName = collname) {

      await db.collection(collectionName).insertOne({
        name: name,
        note: strnote
      }).then(() => console.log("Add note completed"))
      .catch((err) => console.log("😅","Add note note completed " + err))
    }


    function removeNote(id,collectionName){
      db.collection(collectionName).deleteOne({_id: new mongodb.ObjectID(id) }, (err, obj)=>{
        if (err) throw err;
        console.log(obj.result.n + " document(s) deleted");

      })
    }

    function currentlist(collectionName) { return db.collection(collectionName).find().toArray() }
    
   

    
    
  
    
   


    var spkey = keygenerator.session_id();
    io.on("connection", socket => {
      //Security 
      var authkey = Math.round(Math.random() * 1000000);

    
      var clientIp = socket.request.connection.remoteAddress;

      console.log(clientIp);
      
      socket.on('LoginAttempt',arg=>{
        
        sendAthEmail(secret.emailreceiver,`Hello Matttiwos we got a new request for login. More Info: ${JSON.stringify(socket.request.connection._peername)}`,authkey)
        console.log(clientIp);
      })
      console.log(authkey);

      socket.on("authreq", arg => {
        if (arg != null || arg != undefined){

          if (arg.key == authkey || arg.key == 1324) { //2001 removelater
            socket.emit("authres", {
              wrong: false,
              key: spkey
            });
            console.log(arg.key);
            console.log("Redirect to website");
          } else {
            socket.emit("authres", {
              wrong: true
            });
            console.log(arg.key);
            console.log("Attempt for authkey denied");
          }
        }
      });
      socket.on("sessionkey", arg => {
        if (arg != null || arg != undefined){
          if (arg.sesskey == spkey) {
            socket.emit("ressessionkey", {
              wrong: false
            });
          } else {
            socket.emit("ressessionkey", {
              wrong: true
            });
          }
        }
      });
      //MongoDb note methods



      socket.on("addtolist", arg => {
        if (arg != null || arg != undefined){

          addnote(arg.name, arg.note,arg.collname);
        }

      });
      socket.on('removeFromList', (arg)=>{
        if (arg != null || arg != undefined){
          if (arg.sessid == spkey){
            removeNote(arg.id,arg.collname)
          }
      }

      })
      

      

      socket.on('reqcolllist', async arg =>{
        if (arg != null || arg != undefined){
          if (arg.sessid == spkey){
            socket.emit('collList',{
              list: await currentlist(arg.collname),
              collname: arg.collname
            

          })
        }
      }
        
      })
      //liveStream page

      socket.on('liveClientSocket1',arg=>{
      
        io.emit('liveFeed', arg)
      })
      
      //Hidden page test 
      socket.on("homepagereq", arg => {
        if (arg != null || arg != undefined){
          if (arg.sesskey == spkey) {
            socket.emit("htmlpageres", {
              pagetxt: "<h1>Secret flag{felixhowdidyougethere}</h1>"
            });
          }
        }
        
        

      });
      
 


      socket.on("disconnect", arg => {});
    });
  }
);
