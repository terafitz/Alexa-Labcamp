'use strict';

var https = require('https');

// Text blocks for responses

// General Help Text here
var tutorialArray = ['Tutorial test here'];

// Greeting when the skill in launched
var welcomeTextArraySSML = [
    "<speak><prosody volume=\"x-loud\">Hi there!</prosody>  <break strength=\"medium\"/>welcome to our basic skill. I hope you're a better programmer than dan.</speak>",
    "<speak><prosody volume=\"x-loud\">Hey!</prosody>  <break strength=\"medium\"/>I hope you're a better programmer than dan.</speak>"
];

// Dialogue step two
var startTextArray = [
    "Don't lie to me! Your name is not Placeholder, it's Dan Fitzpatrick, the world's worst programmer",
    "No no no, your name is not Placeholder, it's Dan Fitzpatrick, the world's worst programmer"
]; 

// Response when skill is ended
var goodbyeTextArray = [
    "I hope that I could help you",
    "I hope to hear from you soon",
    "It was fun while it lasted",
    "Goodbye. Don't let me get lonely"
];


// Response when skill is ended
var randomResponseArray = [
    "Banging your head against a wall for one hour burns 150 calories.",
    "In Switzerland it is illegal to own just one guinea pig.",
    "Pteronophobia is the fear of being tickled by feathers.",
    "Snakes can help predict earthquakes.",
    "A flock of crows is known as a murder.",
    "The oldest “your mom” joke was discovered on a 3,500 year old Babylonian tablet.",
    "If you lift a kangaroo’s tail off the ground it can’t hop.",
    "Bananas are curved because they grow towards the sun.",
    "The inventor of the Frisbee was cremated and made into a Frisbee after he died.",
    "Heart attacks are more likely to happen on a Monday.",
    "In 2017 more people were killed from injuries caused by taking a selfie than by shark attacks.",
    "The average male gets bored of a shopping trip after 26 minutes.",
    "Mike Tyson once offered a zoo attendant 10000 dollars to let him fight a gorilla."
];

// Sample respone with n placeholders
var testResponseArray = [
    " Placeholder0 Placeholder1 "
];

// Sample response with one placeholder, no answer
var nullAnswerArray = [
    "Sorry Placeholder"
];

var errorsArray = [
    ""
];


exports.handler = (event, context) => {

    try {

        if (event.session.new) {
            // new session
            console.log(`New Session`)
            // onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type == "LaunchRequest") {
            // Launch Request
            console.log(`LAUNCH REQUEST`);

            context.succeed(
                generateResponse(
                    buildSpeechletSSMLResponse(returnRandomResponse(welcomeTextArraySSML, ""), false), {}
                )
            )

        } else if (event.request.type == "IntentRequest") {
            
            // intent request
            var intentName = event.request.intent.name;
            var response;

            switch (event.request.intent.name) {

                case "LaunchResponseIntent":
                var nameInput = event.request.intent.slots.nameSlot.value;
                context.succeed(
                    generateResponse(
                        buildSpeechletResponse(returnRandomResponse(startTextArray, nameInput), false) , {}
                    )
                )                    

                break;


                case "RandomResponseIntent":

                    context.succeed(
                        generateResponse(
                            buildSpeechletResponse(returnRandomResponse(randomResponseArray, ""), false), {}
                        )
                    )

                    break;

                case "AMAZON.HelpIntent":

                    context.succeed(
                        generateResponse(
                            buildSpeechletResponse(returnRandomResponse(tutorialArray, ""), true), {}
                        )
                    )

                    break;

                case "AMAZON.StopIntent":

                    context.succeed(
                        generateResponse(
                            buildSpeechletResponse(returnRandomResponse(goodbyeTextArray, ""), true), {}
                        )
                    )

                    break;
                default:
                    throw "Invalid intent"
            }

        } else if (event.request.type == "SessionEndedRequest") {
            console.log(`SessionEndedRequest`)
            // ended request
            context.succeed(
                generateResponse(
                    buildSpeechletResponse(returnRandomResponse(goodbyeTextArray, ""), true), {}
                )
            )
        }

    } catch (error) { context.fail(`Exception: ${error}`) }

};

// helpers
var buildSpeechletResponse = (outputText, shouldEndSession) => {
    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: shouldEndSession
    }
};

  var buildSpeechletSSMLResponse = (outputText, shouldEndSession) => {
      return{
          outputSpeech: {
              type: "SSML",
              ssml: outputText
          },
          shouldEndSession: shouldEndSession 
      }
  };

var generateResponse = (speechletResponse, sessionAttributes) => {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
};

// take an array of dialog elements (responseArray) and return one at random to give differing responses with the same content
// Placeholder or Placeholder(n) are parsed and replaced with actual variables
var returnRandomResponse = function(responseArray, placeholders) {
    var responseNum;
    var response;
    var p;
    responseNum = Math.floor(Math.random() * responseArray.length);
    response = responseArray[responseNum]
    if(typeof(placeholders) == "string"){
        response = response.replace(/Placeholder/g, placeholders);
    }else{
        // the type here should be an array
        for(p = 0; p < placeholders.length; p++){
          var singlePlaceholder =  'Placeholder' + p.toString();
          placeholders[p] = placeholders[p].toString();
          response = response.split(singlePlaceholder).join(' '+placeholders[p]+' ');
        }
    }
    return response;
}

// for instance €37,50 -> "Siebenunddreißig Euro fünfzig"
var priceParser = function(price, localization){
    var output = "";
    output = " " + price.split(',')[0] + " euro " + price.split(',')[1] + " ";
    return output;
}

var timeConverter = function(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
  return time;
};
