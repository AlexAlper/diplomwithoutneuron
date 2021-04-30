

var formVideo = document.getElementById('send-video-form');

var formPhoto = document.getElementById('send-photo-form');

buttonEmo = document.querySelectorAll('.btn-secondary');

divEmo = document.getElementById('sendEmo');

buttonSendEmo = document.getElementById('sendEmotion');

chooseEmo = document.getElementById('chooseEmo');

imgPhoto = document.getElementById('imgMarkup');

targetEmo = null;

uuid = "";


if(divEmo != null){

  divEmo.style.display = "none";
  chooseEmo.style.display = 'none';
  imgPhoto.style.display = 'none';

divEmo.addEventListener('click', event => {
  chooseEmo.style.display = "";
});

buttonEmo.forEach(function(item) {

  item.addEventListener('click', function(e){
    console.log(e.target.id);
    targetEmo = e.target.id;
  });

});

buttonSendEmo.addEventListener('click', async event => {
  console.log("hi");
  console.log(targetEmo);

  if(targetEmo != null){
    console.log("se");
    let response = await fetch("/wrongEmotion", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      mode: 'same-origin',
      body: JSON.stringify({ targetEmo: targetEmo, uuid: uuid })
    });

    let result = await response.json();
  }
});


}


if(formVideo!=null){
formVideo.addEventListener('submit', async event => {
  event.preventDefault(); // блокируем обычную отправку формы
  uuid = "";
  var formData = new FormData(formVideo);
  let response = await fetch("/video", {
    method: "POST",
    body: formData
  });

  let result = await response.json();

  drawDiagram(result);
  timeLineDiagramm(result.timeline);
});
} 

if(formPhoto!=null){
  formPhoto.addEventListener('submit', async event => {
    event.preventDefault(); // блокируем обычную отправку формы
    uuid = "";
    var formData = new FormData(formPhoto);
    let response = await fetch("/photo", {
      method: "POST",
      body: formData
    });
  
    var answer = document.getElementById('chart_div_emo')
    result = await response.json();
   
    src = result.src;
    imgPhoto.src = result.src;
    imgPhoto.style.display = "";

    answer.innerHTML = result.emotion;
    uuid = result.uuid;
    divEmo.style.display = ""

  });
}


function timeLineDiagramm(line){

  var arr = new Array();
  for (i = 0; i <=line.length;i++){
    arr[i] = new Array();
  }

  for (j=0; j < line.length;j++){
    arr[j+1][0] = j + "";
    arr[j+1][1] = parseFloat(line[j].anger);
    arr[j+1][2] = parseFloat(line[j].contempt);
    arr[j+1][3] = parseFloat(line[j].disgust);
    arr[j+1][4] = parseFloat(line[j].fear);
    arr[j+1][5] = parseFloat(line[j].happy);
    arr[j+1][6] = parseFloat(line[j].sadness);
    arr[j+1][7] = parseFloat(line[j].surprise);

  }

  arr[0][0] = 'сек';
  arr[0][1] = 'anger';
  arr[0][2] = 'contempt';
  arr[0][3] = 'disgust';
  arr[0][4] = 'fear';
  arr[0][5] = 'happy';
  arr[0][6] = 'sadness';
  arr[0][7] = 'surprise';

  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var data = google.visualization.arrayToDataTable(arr);

    var options = {
      title: 'Эмоции на видео',
      hAxis: {title: 'время',  titleTextStyle: {color: '#333'}},
      vAxis: {minValue: 0}
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_di'));
    chart.draw(data, options);
  }
}

function drawDiagram(result){
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  
  function drawChart() {
  
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'эмоция');
    data.addColumn('number', 'значение');
    data.addRows([
      ['злость', result.anger],
      ['презрение', result.contempt],
      ['отвращение', result.disgust],
      ['страх', result.fear],
      ['счастье', result.happy],
      ['грусть', result.sadness],
      ['удивление', result.surprise]       ]);
  
    // Set chart options
    var options = {'title':'Эмоции на данном видео',
                   'width':600,
                   'height':500};
  
    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}


}