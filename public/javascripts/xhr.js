define(["x2js", "jquery"], function(X2JS, $) {

let jsonObj = {};
//invoke ticker here.
let ticker = 0;
let chapterText;
let newNote;
let newArr = [];


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
  jsonParser(jsonObj);
}

function jsonParser(){
  console.log("jsonObj", jsonObj );
  let notes = jsonObj.document.span;

  //convert text to array
  let textArr = chapterText.split('');

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
    let endPoint = Number.parseInt(notes[i].extent.charseq._END) + ticker + 1;

    textArr.splice(endPoint, 0, "</span>");

    //update ticker
    ticker = (ticker + 1);  // This is the length of the injected CSS tag

  }//ends for loop
  //reset ticker
  ticker = 0;
  arrayToDom(textArr);
}

  function arrayToDom (arr){
  //stringify array
  annotatedString = arr.join('');
  //repopulate text-box
  $(".text-box").html(annotatedString);
  // $(".text-box").html(chapterText);
  }


//Load Event Handlers
  //On mousedown, some trickery
  $(".text-box").mousedown(function(){
    $(".text-box").html(chapterText);
  });

  //on mouse up
  $(".text-box").mouseup(function(){
    //grab selection object
    userSelection = document.getSelection();
    console.log("userSelection", userSelection );
    //Create annotation
    let begin = userSelection.anchorOffset;
    let end = userSelection.focusOffset;

    //assure that _START is always < _END
    if (begin > end){
      let temp = end;
      end = begin;
      begin = temp;
    }

    newNote = {
      "_category" : "PERSON",
      "extent" : {
        "charseq" : {
          "_START" : begin.toString(),
          "_END" : end.toString()
        }
      }
    };


    // sort annotation
      let sorted = false;
    for (i = 0; i < jsonObj.document.span.length; i++ ){
      let leftEvalPoint = jsonObj.document.span[i].extent.charseq._START;

      if (begin < leftEvalPoint && sorted === false){
        newArr[i] = newNote;
        sorted = true;
        newArr[(i + 1)] = jsonObj.document.span[i]
        console.log("1");
      }//ends 1st if

      if (begin > leftEvalPoint && sorted === false){
        newArr[i] = jsonObj.document.span[i];
        console.log("2" );
      }//ends 2nd if

      if (sorted === true){
        newArr[(i + 1)] = jsonObj.document.span[i];
        console.log("3" );
      }
    }// ends for loop


    jsonObj.document.span = newArr;
    newArr = [];


    jsonParser();

  }); //ends mouseup action




    ///

  //Add
    //create object injection

    //re-render page

  //Delete
    //find selection in localObj
    // set _START and _END values to false || use 'delete' syntax





function gimmeData(filename){
  let myRequest = new XMLHttpRequest();
    myRequest.addEventListener("load", xmlParser);
    myRequest.addEventListener("error", xhrFail);

    myRequest.open("GET", filename);
    myRequest.send();
}

gimmeData('ch08.txt.xml');

});
