var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var CircularJSON = require('circular-json');
var app = express();

app.get('/scrape', function (req, res) {

  //get professor's info in lancaster
  /**
  var lancasterUrl = 'https://www.lancaster.ac.uk/search/?collection=lancaster-meta&query=computer&tab=people&start_rank=11';

  request(lancasterUrl, function (error, response, html) {

    if (!error) {
      var $ = cheerio.load(html);

      var json = [];

      $('.fb-result__info').filter(function () {
        var data = $(this);
        var fullName = data.children().first().children('.staff-details').children().first().text();
        var title = data.children().first().children('.staff-details').children().last().text();
        var phoneNumber = data.children().last().children('.staff-contact').children().first().text();
        var department = data.children().last().children('.staff-contact').children().last().text();
        var readMoreLink = '';
        var university= 'lancaster';

        json.push({ fullName, title, phoneNumber, department, readMoreLink, university });
      })
    }

    // To write to the system we will use the built in 'fs' library.
    // In this example we will pass 3 parameters to the writeFile function
    // Parameter 1 :  output.json - this is what the created filename will be called
    // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
    // Parameter 3 :  callback function - a callback function to let us know the status of our function

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {

      console.log('File successfully written! - Check your project directory for the output.json file');

    })

    // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
    res.send('Check your console!')

  });

  */

  //get professor's info incoventry
  var coventryUrl = 'https://www.coventry.ac.uk/life-on-campus/staff-directory/?filters=1187';
  
  request(coventryUrl, function (error, response, html) {

    if (!error) {
      var $ = cheerio.load(html);

      var json = [];

      $('.container').filter(function () {
        var data = $(this);
        var fullName = data.children('.row').first().children('.mtm').content();

        console.log('fullname ===> ', fullName);
        // var title = data.children().first().children('.staff-details').children().last().text();
        // var phoneNumber = data.children().last().children('.staff-contact').children().first().text();
        // var department = data.children().last().children('.staff-contact').children().last().text();
        // var readMoreLink = '';
        // var university= 'lancaster';

        json.push({ fullName });
      })
    }

    // To write to the system we will use the built in 'fs' library.
    // In this example we will pass 3 parameters to the writeFile function
    // Parameter 1 :  output.json - this is what the created filename will be called
    // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
    // Parameter 3 :  callback function - a callback function to let us know the status of our function

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {

      console.log('File successfully written! - Check your project directory for the output.json file');

    })

    // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
    res.send('Check your console!')

  });
  
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;