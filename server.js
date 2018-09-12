
const fs = require('fs');
const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser')
const port = 8080 || process.env.PORT;

let url;

// Directories, Files, URLs
const fccCertUrl = "https://www.freecodecamp.org/certification/";
const index = __dirname + '/views/index.html'
const model = __dirname + '/views/model.html';
const certificate = __dirname + '/views/certificate.html';



// App.use
app.use(express.static('public'));
app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// Routes
app.get('/', function(req, res) {
    res.sendFile(index);
});



// Get the form data from post
app.post('/validate', function(req, res) {

    // Get Form url
    url = req.body.url;

    // Check field is not empty and that it is a fcc url
    if (!url || !url.startsWith(fccCertUrl)) {
        res.send("You have not entered a valid URL")
    }
    // Validate that the url exists - only for already claimed certificates
    else {
        const path = url.slice(28,) 
        request(url, function (error, response, body) {

            // Check that the path exists and is a valid certificate
            if (path == response.request.uri.path) { 

                let str = response.body.slice(2965,);  

                // Get the model content with download options
                function getFileContent() { 
                    fs.readFile(model, 'utf8', function (err, data) {
                        if (err) throw err;
                        copyFileContent(data);
                    });
                }
                getFileContent();
                
                // Copy the model to a new file
                function copyFileContent(data) { 
                    fs.writeFile(certificate, data, function(err) {
                        if (err) throw err;
                        appendResponse();
                    });
                }

                // Append the response body to the new file
                function appendResponse() {
                    fs.appendFile(certificate, str,function(err) {
                        if (err) throw err;
                        return res.send("");
                    });
                }
            }
            // If the path doesnt exist - its not a valid certificate
            else {
                return res.send("You have not entered a valid URL")
            }
        })
    }
})



app.get('/certificate', function(err, res) {
    res.sendFile(certificate);
});



// Listen for requests
app.listen(port, function() {});