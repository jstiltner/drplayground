requirejs.config({
  baseUrl: "./javascripts",
  shim : {
        bootstrapJs : {
            deps : [ 'jquery']
        }
    },

  paths:{
    "jquery": "../bower_components/jquery/dist/jquery.min",
    "x2js": "../bower_components/x2js/xml2json.min",
    "es6": "node_modules/requirejs-babel/es6",
    "babel": "node_modules/requirejs-babel/babel-4.6.6.min"


  }
})


require(["jquery", "x2js", "xhr"],
  function($, parser, xhr) {  // eslint-disable-line
});




