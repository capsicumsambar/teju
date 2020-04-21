// Adapted from https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
// var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
// var grammar1 = '#JSGF V1.0; grammar words; public <color> = ' + words1.join(' | ') + ' ;' //need to understand grammar
// var grammar2 = '#JSGF V1.0; grammar words; public <color> = ' + words2.join(' | ') + ' ;'
// var speechRecognitionList = new SpeechGrammarList();// need to understand grammar, see https://github.com/WICG/speech-api/issues/57
// speechRecognitionList.addFromString(grammar1, 1);// need to understand grammar
// speechRecognitionList.addFromString(grammar2, 1);
// recognition.grammars = speechRecognitionList;// need to understand grammar

// enabling enter key for word input
var input = document.getElementsByClassName("wordInput");
for(let i=0; i<input.length;i++){
  input[i].addEventListener("keyup", function(event) {
    if(event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("add").click();
      }
    })
  }
// addRow is used for adding new words to the sight words box
function addRow() { 
  var table = document.getElementById("table");
  
  var row= document.createElement("tr");
  console.log(row);
  var td1 = document.createElement("td");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");    

  td1.innerHTML = document.getElementById("word1").value.toLowerCase().trim();
  td2.innerHTML  = document.getElementById("word2").value.toLowerCase().trim();
  td3.innerHTML  = document.getElementById("word3").value.toLowerCase().trim();

  row.appendChild(td1);
  row.appendChild(td2);
  row.appendChild(td3);

  table.children[0].appendChild(row);
  document.getElementById("word1").value = " ";
  document.getElementById("word2").value = " ";
  document.getElementById("word3").value = " "
};
//end of addRow

//Use webspeech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
//end of objects creation for webspeech

var diagnostic = document.querySelector('.output'); 
var table = document.getElementById("table");// redeclaring as above table declaration is local

// word spoken event is fired after sightbutton is clicked
sightbutton.onclick = function() {
  recognition.start();
  console.log('Ready to receive a word command.');
}

//function for showing results of spoken words
recognition.onresult = function(event) { 
  // coverting HTML table to JS array to check if spoken word is in the sight table box
  var sightTableArray = [];
  var x = document.getElementById("table");
  var noofRows = x.rows.length;
  var noofCols = x.rows[0].cells.length;
  for(let i=0; i<noofRows; i++){
    for(let j=0;j<noofCols; j++){
      sightTableArray.push(x.rows[i].cells[j].innerHTML)
    }
  }
  sightTableArray = sightTableArray.map(e1 => e1.trim()) //ensures words entered are deleted of leading spaces 
  console.log(sightTableArray)
  // array of sight words created above
  
  //capture spoken word using webspeech API
  var wordSpoke = event.results[0][0].transcript.toLowerCase();  
  diagnostic.innerHTML = 'You spoke: ' +  '<span style="color:red">' + wordSpoke + '</span>';
  if(sightTableArray.includes(wordSpoke)){
    wordSpoke = wordSpoke.valueOf(); // not sure if valueOf is really needed
    for(let i=0; i<noofRows; i++){
      for(let j=0;j<noofCols; j++){
        wordCheck = table.rows[i].cells[j].innerHTML.valueOf(); //not sure if valueOf is really needed
        console.log(table.rows[i].cells[j].innerHTML);
        if(wordCheck == wordSpoke){
          table.rows[i].cells[j].innerHTML = "Good job!";
          table.rows[i].cells[j].style.color = "green";
        }
      }
    }
    $('h5').remove();
    $('h6').remove();
    $('#sticker').append("<div class='sticker-img'><img src='stallion.jpg' width='120' height='120'></div>");
    // document.querySelector('#airhorn').play();
  };
  console.log(sightTableArray)
  console.log('Confidence: ' + event.results[0][0].confidence);
}

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that word.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}
