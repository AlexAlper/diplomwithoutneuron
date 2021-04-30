
var Blob = require('blob');
const express = require ("express");
const fs = require('fs');
const multer  = require("multer");
//var ffmpeg = require('ffmpeg');
var ffmpeg = require('fluent-ffmpeg');



let {PythonShell} = require('python-shell')  



var user = require('./user.js');


const emotionClient = express();
emotionClient.use(express.json({limit: '50mb'}));


emotionClient.use(express.static(__dirname+ "/client/"));

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "image");
    },
    filename: (req, file, cb) =>{
        var date = new Date();
        var now = date.getFullYear() + "" + date.getMonth() + date.getDate() + date.getHours() + date.getSeconds() + date.getMilliseconds()
        cb(null, now+file.originalname);
    }
});

const upload = multer({storage:storageConfig});



emotionClient.get('/lol', (req, res) => {
    let fileContent = fs.readFileSync("C:/Users/Alex/Desktop/diplomJS/text.txt", "utf8");
     console.log("/////////////////////////////////")
      console.log(fileContent);
      console.log("/////////////////////////////////")
})

//записать информацию о выбранной эмоции пользователем при разметке
emotionClient.post("/markupDataset",  async function (req, res, next) {

   console.log(1);
   const reqJson = req.body;
   var img = await user.markupDataset(reqJson.targetEmo, reqJson.src);
   res.send({  src: img});
});


//Получить фото для разметки
emotionClient.post("/getPhoto",  async function (req, res, next) {

   console.log(1);
   
   var img = await user.getRandomPhotoMarkup();
   res.send({  src: img});
});



//видео с web-панели
emotionClient.post("/video", upload.single("filedata"), async function (req, res, next) {
   
   let filedata = req.file;
   console.log(req.file.filename);
   name =req.file.filename;
   if(name.substr(name.length-3, name.length-1) != "mp4"){
      console.log("err")
      res.send("Ошибка при загрузке файла");
   } else {

   
     // var process = new ffmpeg('C:/Users/Alex/Desktop/Диплом/diplomJS/image/' + req.file.filename);
   //video.fnExtractFrameToJPG("C:/Users/Alex/Desktop/Диплом/diplomJS/video", {
 a = await user.giveVideo();

 console.log(a);
 if(a == "err"){
    console.log("err")
   res.send("Ошибка при загрузке файла");
 } else {
  ffmpeg('C:/Users/Alex/Desktop/diplomJS/image/' + req.file.filename)
  .screenshots({
    // Will take screens at 20%, 40%, 60% and 80% of the video
    timestamps: ['00:01', '00:02','00:03', '00:04', '00:05','00:06','00:07', '00:08','00:09','00:10', '00:11','00:12', '00:13','00:14','00:15', '00:16','00:17'],
    folder: "C:/Users/Alex/Desktop/diplomJS/neuro/dataset/video/photo"
  });


   console.log('lol');
   
   const { spawn } = require('child_process');
   const pyProg = spawn('python',['C:/Users/Alex/Desktop/diplomJS/neuro/video.py']);

   pyProg.stdout.on('data',  function(data) {


      console.log(3)
      setTimeout( async function() { 


         i = 0;
   
         var lineReader = require('readline').createInterface({
           input: require('fs').createReadStream('C:/Users/Alex/Desktop/diplomJS/text.txt')
         });
  
         var myEmotion = [];
         
         await lineReader.on('line', await function (line) {
          // console.log('Line from file:', line);
           var arrayOfStrings = line.split(',');
           var myCar = {};
           myCar.anger = arrayOfStrings[0];
           myCar.contempt = arrayOfStrings[1];
           myCar.disgust = arrayOfStrings[2];
           myCar.fear = arrayOfStrings[3];
           myCar.happy = arrayOfStrings[4];
           myCar.sadness = arrayOfStrings[5];
           myCar.surprise = arrayOfStrings[6];
           myEmotion[i] = myCar;
          // myEmotion.push(myCar);
           
          // console.log(myCar);
           i++;
         });


         //data = data.toString().substr(0, data.toString().length - 2).replace(/'/g, "");
      data = data.toString(); 
      // data = data.toString().substr(0, data.toString().length - 2);
       data = JSON.stringify(data);
       //console.log(data.toString());
       //data = data.toString();
       //console.log(data);
       data = JSON.parse(data);
       data = JSON.parse(data.toString())
       console.log({anger: data.anger, contempt: data.contempt, disgust: data.disgust, fear: data.fear, happy: data.happy, sadness: data.sadness, surprise: data.surprise});
       
       setTimeout( async function() {

         console.log(myEmotion);
         res.send({anger: data.anger, contempt: data.contempt, disgust: data.disgust, fear: data.fear, happy: data.happy, sadness: data.sadness, surprise: data.surprise, timeline: myEmotion});
       }, 500);
       
      }, 500);
      console.log(4)
      
      
         //res.send({anger: 2, contempt: 0, disgust: 2, fear: 1, happy: 2, sadness: 3, surprise: 2});
   });


   if(!filedata)
       res.send("Ошибка при загрузке файла");
      }}
});

//фото с веб панели
emotionClient.post("/photo", upload.single("filedata"), async function (req, res, next) {
   
   let filedata = req.file;
console.log(1)
name =req.file.filename;

if(name.substr(name.length-3, name.length-1) != "jpg"){
   console.log("err")
   res.send("Ошибка при загрузке файла");
} else {


   var emotion = "e";
 var ud =  await user.givePhoto(req.file.filename);

 const { spawn } = require('child_process');
 // const pyProg = spawn('python',['C:/Users/Alex/Desktop/diplomJS/neuro/work.py']);
 const pyProg = spawn('python',['C:/Users/Alex/Desktop/diplomJS/neuro/work.py']);

  await pyProg.stdout.on('data',  function(data) {

      console.log(data.toString());
      emotion = data.toString();
      res.send({  emotion: emotion, uuid: ud.uuid, src: ud.src});
  });


   if(!filedata)
       res.send("Ошибка при загрузке файла");
   else{
      
   }
}
});

 emotionClient.get("/imageName", async (req, res) =>{

   result = await user.getImageName();
   console.log(result);
   res.send(JSON.stringify(result));

})

 emotionClient.post("/login", async (req, res) => {
   var result = "";
   try{
      const reqJson = req.body;
      console.log(reqJson);
       result = await user.login(reqJson.login, reqJson.password)   

      if(result == undefined){
         res.status(404);
       res.statusMessage = "Not found";
      } else {
         result.success = true;
         result = {
            "login": result.login,
            "email": result.email
         };
      }   
   }
   catch(e){
      console.log(e);
       result.success=false;
       res.status(300);
       res.statusMessage = "Error server";
       
   }
   finally{
       res.setHeader("content-type", "application/json");
       res.send(JSON.stringify(result));
   } 
});

emotionClient.post("/registration", async (req, res) => {
   var result = "";
   try{
      const reqJson = req.body;
      console.log(reqJson);
       result = await user.registration(reqJson.login, reqJson.email ,reqJson.password)   

      if(result.message != undefined){
         res.status(404);
       res.statusMessage = "user already exists";
      }

      if(result == undefined){
         res.status(404);
       res.statusMessage = "Not found";
      } else {
         result.success = true;
         result = {
            "login": result.login,
            "email": result.email
         };
      }   
   }
   catch(e){
      console.log(e);
       result.success=false;
       res.status(300);
       res.statusMessage = "Error server";
       
   }
   finally{
       res.setHeader("content-type", "application/json");
       res.send(JSON.stringify(result));
   } 
});


emotionClient.post("/changeEmail", async (req, res) => {
   var result = "";
   try{
      const reqJson = req.body;
      console.log(reqJson);
       result = await user.changeEmail(reqJson.login, reqJson.email)   

      if(result.message != undefined){
         res.status(404);
       res.statusMessage = "user not found";
      } else {
         result.success = true;
         result = {
            "login": result.login,
            "email": result.email
         };
      }   
   }
   catch(e){
      console.log(e);
       result.success=false;
       res.status(300);
       res.statusMessage = "Error server";
       
   }
   finally{
      console.log(result);
       res.setHeader("content-type", "application/json");
       res.send(JSON.stringify(result));
   } 
})

//когда пользователь не согласен с эмоцией 
emotionClient.post("/wrongEmotion", async (req, res) => {
   var result = "";
   try{
      console.log('lol');
      const reqJson = req.body;
       await user.sendPhotoMarkup(reqJson.targetEmo, reqJson.uuid);
      // result = await user.login(reqJson.login, reqJson.password)   

         result.success = true;
         result = {
            "answer": reqJson.targetEmo,
         };
      
   }
   
  

   catch(e){
      console.log(e);
       result.success=false;
       res.status(300);
       res.statusMessage = "Error server";
       
   }
   finally{
       res.setHeader("content-type", "application/json");
       res.send(JSON.stringify(result));
   } 
});


emotionClient.post("/photoEmotion", async (req, res) => {
   var result = "happy";
   try{
      const reqJson = req.body;

      console.log(reqJson);  

      const buf = Buffer.from(reqJson, 'base64');
      var date = new Date();
      var now = date.getFullYear() + "" + date.getMonth() + date.getDate() + date.getHours() + date.getSeconds() + date.getMilliseconds()
      now = now + ".jpg";
     
      var ok = false;

      fs.writeFile(`./imagePhone/${now}`, buf, 'binary', function(err) {
      if(err) {
          console.log(err);
      } else {
          console.log("The file was saved!");
          ok = true;
      }
      });

     result = await user.givePhotoPhone(now);

     const { spawn } = require('child_process');
     // const pyProg = spawn('python',['C:/Users/Alex/Desktop/diplomJS/neuro/work.py']);
     const pyProg = spawn('python',['C:/Users/Alex/Desktop/diplomJS/neuro/work.py']);
    
      await pyProg.stdout.on('data',  function(data) {
    
          console.log(data.toString());
          result = data.toString();
          res.send(JSON.stringify(result));
      });

   }
   catch(e){
      console.log(e);
       result.success=false;
       res.status(300);
       res.statusMessage = "Error server";
       
   }
})
 
module.exports = emotionClient;