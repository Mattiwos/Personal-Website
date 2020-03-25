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
const password = "Iag8m4arZ9ymTyPz";
// const { MongoClient } = require("mongodb");
var mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient
const Request = require("request");
// function getWordofTheDay(){
//   Request.get("https://dictionaryapi.com/api/v3/references/collegiate/json/test?key=9e9ca34c-7e51-41cc-bf5e-4dd5e8a0f613", (error, response, body) => {
//     if(error) {
//         return error;
//     }
//     response = response.json()
//     .then(data => {
//       console.log(data)
      
//     }

//     // wod = {
//     //   word: JSON.stringify(JSON.parse(body)[0].meta.id), // string
//     //   shortdef: JSON.stringify(JSON.parse(body)[0].shortdef), //string array
//     //   date: JSON.stringify(JSON.parse(body)[0].date)

//     // }
    
   
//   });

// } 




//const url = "mongodb://127.0.0.1:27017";
const secret = require('./secret.js')

const url = secret.mongodburl; 

const dbName = "NoteApp2";
let db;
const collname = "Note";

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
    db = client.db(dbName);


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

    function currentlist() { return db.collection(collname).find().toArray() }
    
    // console.log(currentlist())

    
    
    
    // async function updatenote() {
    //   await db.collection(collname)
    //     .find({})
    //     .toArray(function(err, result) {
    //       if (err) throw err;
    //       return result;
    //     });
    // }
    
   


    var spkey = keygenerator.session_id();
    io.on("connection", socket => {

      var authkey = Math.round(Math.random() * 1000000);

      console.log(authkey);

      socket.on("authreq", arg => {
        if (arg.key == authkey || arg.key == 1234) { //2001 removelater
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
      });
      socket.on("addtolist", arg => {
        addnote(arg.name, arg.note);
     

      });
      

      socket.on("sessionkey", arg => {

        if (arg.sesskey == spkey) {
          socket.emit("ressessionkey", {
            wrong: false
          });
        } else {
          socket.emit("ressessionkey", {
            wrong: true
          });
        }
      });

      socket.on('reloadnote', async arg =>{
        if (arg.sessid == spkey){
          socket.emit('notes',{
            notes: await currentlist()
        
          })
          

        }
        
      })
      socket.on('liveClientSocket1',arg=>{
      
        io.emit('liveFeed', arg)
      })
      socket.on('removeFromList', (arg)=>{
        if (arg.sessid == spkey){
          removeNote(arg.id,collname)
        }

      })

      socket.on("homepagereq", arg => {
        if (arg != null || arg != undefined){
          if (arg.sesskey == spkey) {
            socket.emit("htmlpageres", {
              pagetxt: "<h1>Secret flag{felixhowdidyougethere}</h1>"
            });
          }
        }
        
        

      });
      
      // socket.on("wordofthedayreq", arg => {
        
      //       getWordofTheDay();
      //       console.log(console.log(JSON.stringify(wod)));

      //       socket.emit("wordoftheday", {
      //         wod: JSON.stringify(getWordofTheDay()),
      //         test: "sdsd"
      //       });

      // });


      socket.on("disconnect", arg => {});
    });
  }
);
