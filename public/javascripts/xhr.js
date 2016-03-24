define(["x2js"], function(X2JS) {

let jsonObj = {};
//invoke ticker here.
let ticker = 0;
let chapterText;

function cbPopulateDom () {
  chapterText = this.responseText;
  // $(".text-box").html(text);
}

function xhrFail(){
  throw err;
}


function xmlRequest(filename){
  let myRequest = new XMLHttpRequest();
  myRequest.addEventListener("load", cbPopulateDom);
  myRequest.addEventListener("error", xhrFail);

  myRequest.open("GET", filename);
  myRequest.send();
}

xmlRequest('ch08.txt')

function xmlParser(){

  let x2js = new X2JS();
  jsonObj = x2js.xml_str2json( this.responseText );
  console.log("jsonObj", jsonObj.document.span[1]);
  //parse jsonObj
  let notes = jsonObj.document.span;
  // console.log(notes.span[1].extent.charseq._START);


  //convert text to array
  let textArr = chapterText.split('');
  console.log("textArr", textArr );

  //loop over for each item in annotation array
  for (i = 0; i<notes.length; i++){

    //splice array at (_START + ticker) to insert open tags
    let startPoint = Number.parseInt(notes[i].extent.charseq._START) + ticker;

    let injectionString;
    if (notes[i]._category === 'PERSON'){
      injectionString = "<span class='person'>";
    }
    if (notes[i]._category === 'LOCATION') {
      injectionString = "<span class='location'>";
    }
    if (notes[i]._category === 'ORGANIZATION') {
      injectionString = "<span class='organization'>";
    }

    //injects the injection string into the array of text characters
    textArr.splice(startPoint, 0, injectionString);
    //update ticker
    ticker = (ticker + 1);  // This is the length of the injected CSS tag
    //splice array at (_END + ticker) to insert closing tags
    let endPoint = Number.parseInt(notes[i].extent.charseq._END) + ticker+1;

    textArr.splice(endPoint, 0, "</span>");

    //update ticker
    ticker = (ticker + 1);  // This is the length of the injected CSS tag
  }
  //stringify array
  annotatedString = textArr.join('');

  //repopulate text-box
  $(".text-box").html(annotatedString);



//Text selection
  //on mouse up
  $(".text-box").mouseup(function(){
    //grab selection object
    userSelection = document.getSelection();
  var rangeObject = getRangeObject(userSelection);

function getRangeObject(selectionObject) {
  if (selectionObject.getRangeAt)
    return selectionObject.getRangeAt(0);
  else { // Safari!
    var range = document.createRange();
    range.setStart(selectionObject.anchorNode,selectionObject.anchorOffset);
    range.setEnd(selectionObject.focusNode,selectionObject.focusOffset);
    return range;
  }
}

    //log selected text
    console.log('rangeObject', rangeObject)
  })

  //Add
    //create object injection
    //re-render page

  //Delete
    //find selection in localObj
    // set _START and _END values to false || use 'delete' syntax


}

function gimmeData(filename){
  let myRequest = new XMLHttpRequest();
    myRequest.addEventListener("load", xmlParser);
    myRequest.addEventListener("error", xhrFail);

    myRequest.open("GET", filename);
    myRequest.send();
}

gimmeData('ch08.txt.xml');
});
