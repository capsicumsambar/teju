// Adapted from https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var words1 = ['this','down','big','come','what','look'];
var words2 = ['you','have','like','here','small','big']
var grammar1 = '#JSGF V1.0; grammar words; public <color> = ' + words1.join(' | ') + ' ;'
var grammar2 = '#JSGF V1.0; grammar words; public <color> = ' + words2.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar1, 1);
speechRecognitionList.addFromString(grammar2, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints1 = document.querySelector('.hints1');
var hints2 = document.querySelector('.hints2');

var words1HTML= '';
var count1=1;
words1.forEach(function(v, i, a){
  console.log(v, i);
  words1HTML += '  '+ count1+ ')' + v ;
  count1++;
});
hints1.innerHTML = '<span style="color:blue">' + words1HTML + '</span>' + '<br>';

var words2HTML= '';
words2.forEach(function(v, i, a){
  console.log(v, i);
  words2HTML += '  '+ count1+ ')' + v ;
  count1++;
});
hints2.innerHTML = '<span style="color:blue">' + words2HTML + '</span>' + '<br>';

document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive a word command.');
}

recognition.onresult = function(event) {
  var wordSpoke = event.results[0][0].transcript;
  diagnostic.textContent = 'You spoke: ' +  wordSpoke + '.';
  if(words1.includes(wordSpoke) || words2.includes(wordSpoke)){
    $('h3').remove();
    $('#sticker').append("<div class='sticker-img'><img src='wildkratts.jpg' width='120' height='120'></div>");
    document.querySelector('#airhorn').play();
  };
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
