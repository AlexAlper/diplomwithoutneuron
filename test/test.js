

const fs = require('fs');

var user = require('../user/user.js');

const mocha = require('mocha')

const expect = require("chai").expect



describe('Тестирование запросов к БД', () => {

  var tests = [
    {args: ["гнев"], expected: false},
    {args: ['радость'], expected: true},
    {args: ['грусть'], expected:true},
    {args: ['удивление'], expected: true}
  ];


  tests.forEach(function(test) {
    it(`Тест ${ test.args[0]} `, async function() {
      result = await user.getEmotions(test.args[0])
      expect(Number.isInteger(await result.rows[0].num )).to.equal(test.expected)
    });
  });

  it('Тест строки', async () => {
   result = await user.getEmotions("13")
  expect(result.rows[0]).to.equal(undefined);
  })

  it('Тест числа', async () => {
    result = await user.getEmotions(13)
   expect(result.rows[0]).to.equal(undefined);
   })


})


/*

async function testTrue() {
    result = await user.getEmotions("гнев");
    
    fs.appendFile("hello.txt", `Тест гнева: ${ Number.isInteger(result)} \n`, function(error){
        if(error) throw error;
 })};

 async function testFalse() {
     try{
        result = await user.getEmotions(13);
        fs.appendFile("hello.txt", `Неверный тест: false \n`, function(error){
            if(error) throw error;
     });
     }
     catch(e){
        fs.appendFile("hello.txt", `Неверный тест: true \n`, function(error){
            if(error) throw error;
     });
     }
    }


 //fs.writeFileSync("hello.txt", "Test");
 const content = 'Start Test \n'
 try {
   const data = fs.writeFileSync('hello.txt', content);
   console.log("sucsess")
   //файл записан успешно
 } catch (err) {
   console.error(err)
 }
 //testTrue();
 //testFalse();
 */

 /*
 it("should multiply two numbers", function(){
     
    var expectedResult = 15;
    var result = operations.multiply(3, 5);
    if(result!==expectedResult){
        throw new Error(`Expected ${expectedResult}, but got ${result}`);
    }
});
*/