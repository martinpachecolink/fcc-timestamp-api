// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date?", function(req, res){

  let dateParam = req.params.date;
  console.log('dateParam', dateParam)
  
  let date;

  let unixResponse, utcResponse;

  
  // Handle if param is given
  if( dateParam ){

    
    
    dateParam = dateParam.replace(', GMT', '')
    console.log('--->', dateParam)
  
    
    // Handle if date is unix string
    if( isUnix(dateParam) ){
      console.log('date is unix: ', dateParam)
      
      let unixValue = parseInt( dateParam )
      date = new Date( unixValue )
  
      // Handle response
      console.log('responding A', { unix : unixValue, utc : dateToUTC( date ) })
      res.send({ unix : unixValue, utc : dateToUTC( date ) })
      return;
    // Handle if date is dashed string
    } else {
      console.log('validating dateParam', dateParam)
      
      if( isValidDate( dateParam ) ){
          
        date = new Date(dateParam)
        
      } else {
          // Handle error
        console.log('responding B',{ error : "Invalid Date"  })
        res.send( { error : "Invalid Date"  }) 
        return;
      }
  
      // Handle response
      console.log('responding C', { unix : dateToUnix( date ), utc : dateToUTC( date ) })
      res.send({ unix : dateToUnix( date ), utc : dateToUTC( date ) })
      return;
      
    } 
  
    
  } 
  
  // Handle when no param is given
  date = new Date()
  console.log('responding D', { unix : dateToUnix( date ), utc : dateToUTC( date ) })
  res.send({ unix : dateToUnix( date ), utc : dateToUTC( date ) })
  return;
  

  
})


function dateToUTC(date){
  return date.toUTCString();
}

function isUnix(param){
  return ! param.includes('-') && ! param.includes(' ')
}

function fromStringToDate(dateString){
  //let dateArray = dateString.split('-');
  return new Date(dateString);
}

function dateToUnix(date){
  let timeInMillisecond = date.getTime();
  const unixTimestamp = Math.floor(date.getTime() );
  console.log(unixTimestamp);   // 1623801600
  return unixTimestamp;
}


function isValidDate(dateString){

  if( dateString.includes(' ')){
    dateString = dateString.replaceAll(' ', '-')
  }

  
  if(dateString.includes('-')){    
    let dateArray = dateString.split('-');
    console.log('evaluating: ', dateArray)
    if(dateArray.length == 3  ){
      console.log('valid date.')
      return true
    }
  }

  
  console.log('not a valid date.')
  return false;
  
  
  
}








// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
