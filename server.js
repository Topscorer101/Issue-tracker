'use strict';

var express = require('express');
var expect = require('chai').expect;
var cors = require('cors');
var bodyParser = require('body-parser');
var pug = require('pug');
var helmet = require('helmet');

var apiRoutes = require('./routes/api.js');
var fccTestingRoutes = require('./routes/fcctesting.js');
var runner = require('./test-runner');

var app = express();


// Set the view engine to Pug (formerly Jade)
app.set('view engine', 'pug')


app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TODO: Prevent cross site scripting(XSS attack).
app.use( helmet.xssFilter() )


//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);


//404 Not Found Middleware
app.use(function(req, res, next) {
    res.status(404)
    .type('text')
    .send('Not Found');
});
//500 Error Middleware
app.use( (err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
    next();
});


//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port " + process.env.PORT);
    if(process.env.NODE_ENV==='test') {
        console.log('Running Tests...');
        setTimeout(function () {
            try {
                runner.run();
            }
            catch(e) {
                var error = e;
                console.log('Tests are not valid:');
                console.log(error);
            }
        }, 3500);
    }
});


module.export = app; //for testing
