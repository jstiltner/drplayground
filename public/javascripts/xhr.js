define(["x2js", "jquery"], function(X2JS, $) {

let jsonObj = {};
//invoke ticker here.
let ticker = 0;
let chapterText;
let newNote;
let newArr = [];
let catValue




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
      injectionString = "<span class='PERSON'>";
    }
    if (notes[i]._category === 'LOCATION') {
      injectionString = "<span class='LOCATION'>";
    }
    if (notes[i]._category === 'ORGANIZATION') {
      injectionString = "<span class='ORGANIZATION'>";
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
  // $(".top-text-box").html(chapterText);
  }


//Load Event Handlers
  //On mousedown, some trickery
  $('.PERSON').click(function(){
    catValue = "PERSON";
  })
  $('.LOCATION').click(function(){
    catValue = "LOCATION";
  })
  $('.ORGANIZATION').click(function(){
    catValue = "ORGANIZATION";
  })

  $('.DELETE').click(function(){
    catValue = "DELETE";
  })

  $( "#save" ).click(function() {
    this.href = 'data:plain/text,' + JSON.stringify(jsonObj)
  });

  $(".text-box").mousedown(function(){
    $(".text-box").html(chapterText);
  });

  //on mouse up
  $(".text-box").mouseup(function(){
    //grab selection object
    userSelection = document.getSelection();
    console.log("userSelection", userSelection );
    //create object injection
    let begin = userSelection.anchorOffset;
    let end = userSelection.focusOffset;

    //assure that _START is always < _END
    if (begin > end){
      let temp = end;
      end = begin;
      begin = temp;
    }

    newNote = {
      "_category" : catValue,
      "extent" : {
        "charseq" : {
          "_START" : begin.toString(),
          "_END" : end.toString()
        }
      }
    };

    if (catValue === "DELETE"){

      for (i = 0; i < jsonObj.document.span.length; i++ ){
        let stringBegin = begin.toString();
        let stringEnd = end - 1;
        stringEnd = stringEnd.toString();
        console.log(stringBegin, stringEnd );
        if (stringBegin === jsonObj.document.span[i].extent.charseq._START && stringEnd === jsonObj.document.span[i].extent.charseq._END){
            jsonObj.document.span.splice(i, 1);
        }//ends matching if statement
      }//ends for loop
    } else {

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

    jsonObj.document.span = newArr; // re-attach array to big object
    newArr = []; //empty array for next use

  }//ends else statement


    //re-render page
    console.log("rerender called" );
    jsonParser();

  }); //ends mouseup action

  //Delete
    //find selection in localObj
    //grab begin and end
    //compare begin and end to fields in object
    //if perfect match, then delete that array
    //if not perfect match, alert the user






function gimmeData(filename){
  let myRequest = new XMLHttpRequest();
    myRequest.addEventListener("load", xmlParser);
    myRequest.addEventListener("error", xhrFail);

    myRequest.open("GET", filename);
    myRequest.send();
}

gimmeData('ch08.txt.xml');

});
