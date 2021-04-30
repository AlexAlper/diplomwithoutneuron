var {Client} = require("pg");

var uuid = require('uuid/v1');

var ncp = require('ncp').ncp;
var fs = require('fs');
var config = require('../config/config.json')

const path = require('path');


const client = new Client({
    "user": config.user,
    "password" :  config.password,
    "host" : config.host,
    "port" : config.port,
    "database" : config.database
 })

 start();

 async function start() {
    await connect();
}

async function connect() {
    try {
        await client.connect();
    }
    catch(e) {
        console.error(`Failed to connect ${e}`)
    }
}


module.exports = {


 getImageName : async function(){
    try {
       const result =  await client.query(`select src from face`);
       console.table(result.rows)
       return result.rows;
       }
       catch(e){
           console.log(e);
       }
 },


 login: async function(login, pass){

    try{
        const results = await client.query(`select * from users where login = '${login}' and password = '${pass}'`);
        return results.rows[0];
    } catch(e){
        console.log(e);
        return e;
    }
 },

 
 registration : async function (login, email, pass){
    try{
    const result = await client.query(`select * from users where login = '${login}'`);
       
    if(result.rows[0] != undefined){
       return {message: "Такой пользователь уже зарегистрирован!"};
    } else {
        await client.query(`insert into users values ('${uuid()}', '${login}', '${pass}', '${email}')`);
        const result = await client.query(`select * from users where login = '${login}'`);
        return result.rows[0];
    }
    } catch(e){
        console.log(e);
        return e;
    }
 },

 
 changeEmail : async function (login, email){
    try{

        await client.query(`update users set email =  '${email}' where login = '${login}'`);

        const result = await client.query(`select * from users where login = '${login}'`);
        return result.rows[0];
    } catch(e){
        console.log(e);
        return e;
    }
 },

 //Получить эмоции использовалось раньше
 getEmotions : async function (name){
    try {
        name = name.toString();
       const results = await client.query(`select * from emotions where name = '${name.toLowerCase()}'`);
      // var a = results.rows[0].num + 1;
      // await client.query(`UPDATE emotions SET num = ${a} WHERE name = '${results.rows[0].name}';`);
       return results;
       }
       catch(e){
           console.log(e);
           return e;
       }
 },

 //Добавить фото в бд
 givePhotoPhone: async function(name){
    try {
        name = name.toString();
        ud = uuid();
        await client.query(`insert into face values ('${ud}', '${name}')`);
        
        const results = await client.query(`select src from face where id = '${ud}'`);


        const directory = 'neuro/dataset/work/photo';

        fs.readdir(directory, (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
              fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
              });
            }
          });



        await ncp(`imagePhone/${results.rows[0].src}`, `neuro/dataset/work/photo/${results.rows[0].src}`, await function (err) {
            if (err) {
              return console.error(err);
            }
            console.log('done!');
           });

      // var a = results.rows[0].num + 1;
      // await client.query(`UPDATE emotions SET num = ${a} WHERE name = '${results.rows[0].name}';`);
       return ud;
       }
       catch(e){
           console.log(e);
           return e;
       }
 },

 givePhoto: async function(name){
    try {
        name = name.toString();
        ud = uuid();
        await client.query(`insert into face values ('${ud}', '${name}')`);
        
        const results = await client.query(`select src from face where id = '${ud}'`);


        const directory = 'neuro/dataset/work/photo';

        fs.readdir(directory, (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
              fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
              });
            }
          });



        await ncp(`image/${results.rows[0].src}`, `neuro/dataset/work/photo/${results.rows[0].src}`, await function (err) {
            if (err) {
              return console.error(err);
            }
            console.log('done!');
           });

      // var a = results.rows[0].num + 1;
      // await client.query(`UPDATE emotions SET num = ${a} WHERE name = '${results.rows[0].name}';`);
       return {uuid: ud, src: results.rows[0].src};
       }
       catch(e){
           console.log(e);
           return e;
       }
 },


 //работа с видео в нейронке
 giveVideo: async function(name){
    try {
        const directory = 'neuro/dataset/work/photo';

        fs.readdir(directory, (err, files) => {
            if (err) {return "err"}
          
            for (const file of files) {
              fs.unlink(path.join(directory, file), err => {
                if (err) return "err";
              });
            }
          });

          return;
        } catch(e){
          return "err"
        }

 },


 sendPhotoMarkup: async function(emotion, ud){
    try {
        console.log(2)
        const results = await client.query(`select src from face where id = '${ud}'`);

        await ncp(`image/${results.rows[0].src}`, `markup/${results.rows[0].src}`, await function (err) {
            if (err) {
              return console.error(err);
            }
            console.log('done!');
           });

        ud2 = uuid();
        await client.query(`insert into markup(id, src, ${emotion}) values ('${ud2}', '${results.rows[0].src}', 1)`);

         await  fs.unlink(`image/${results.rows[0].src}`, function(err) {
            if (err) throw err;});

            await client.query(`DELETE FROM face WHERE id = '${ud}'`)

      console.log(3)
       return ud;
       }
       catch(e){
           console.log(e);
           return e;
       }
 },

 getRandomPhotoMarkup: async function(){
    try {
        console.log(2)
        
        const results = await client.query(`select src from markup order by random() limit 1000;`);

       return results.rows[0].src;
       }
       catch(e){
           console.log(e);
           return e;
       }
 },

 //Добавить информацию об эмоции в разметку
 markupDataset: async function(emotion, src){
    try {
        console.log(2)
        console.log(emotion);
        const results = await client.query(`select ${emotion} from markup where src = '${src}'`);
        number = results.rows[0][emotion] + 1;
        console.log(number);
        await client.query(`update markup set ${emotion} =  '${number}' where src = '${src}'`);

        if(number>=6){

            await ncp(`markup/${src}`, `neuro/dataset/retraining/${emotion}/${src}`, await function (err) {
                if (err) {
                  return console.error(err);
                }
                console.log('done!');
               });
    
            ud2 = uuid();
            await client.query(`insert into dataset(id, src, emotion) values ('${ud2}', '${src}', '${emotion}')`);
    
             await  fs.unlink(`markup/${src}`, function(err) {
                if (err) throw err;});
    
                await client.query(`DELETE FROM markup WHERE src = '${src}'`)

        }
        //const results = await client.query(`select src from markup order by random() limit 1000;`);

       return src;
       }
       catch(e){
           console.log(e);
           return e;
       }
 },

}