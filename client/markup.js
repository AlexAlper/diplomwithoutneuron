
imgPhoto = document.getElementById('imgMarkup');
buttonEmo = document.querySelectorAll('.btn-secondary');
buttonSend = document.getElementById('sendEmotion');


imgPhoto.style.display = 'none';

targetEmo = null;

src = "";

buttonEmo.forEach(function(item) {

    item.addEventListener('click', function(e){
      console.log(e.target.id);
      targetEmo = e.target.id;
    });
  
  });


  buttonSend.addEventListener('click', async event => {
  
    if(targetEmo != null){
    //  console.log("se");
      let response = await fetch("/markupDataset", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        mode: 'same-origin',
        body: JSON.stringify({ targetEmo: targetEmo, src: src })
      });
  
     // let result = await response.json();
     // console.log(result.answer);
    }

    window.location.reload();
  })


getPhoto();
  
  async function getPhoto(){
        console.log("se");
        let response = await fetch("/getPhoto", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          mode: 'same-origin'
        });
    
        let result = await response.json();
        console.log(result.src);
        src = result.src;
        imgPhoto.src = result.src;
        imgPhoto.style.display = "";
        
      
  }


  
