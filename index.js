var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function (req, res) {



  var json = [];
  //get professor's info in lancaster

  var lancasterUrl = 'https://www.lancaster.ac.uk/search/?collection=lancaster-meta&query=computer&tab=people&start_rank=11';
  //get professor's info incoventry
  var imperialUrl = 'https://www.imperial.ac.uk/computing/people/academic-staff/';

  request(lancasterUrl, function (error, response, html) {

    if (!error) {
      var $ = cheerio.load(html);

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

  });


  //get professor's info in imperial
  request(imperialUrl, function (error, response, html) {

    if (!error) {
      var $ = cheerio.load(html);

      $('ul[class="people list"]').find('li').each(function (index, element) {
       var fullName = $(element).find('.sr-only').text();
       var researchInterest = $(element).find('.dept-wrapper').find('p').find('span').text();
       var readMoreLink = $(element).find('.name-wrapper').find('a').attr('href');
       var title = $(element).find('.name-wrapper').find('.job-title').text();
       var email = $(element).find('.name-wrapper').find('.contact').find('a').attr('href').split(':')[1];
       var phoneNumber = $(element).find('.name-wrapper').find('.contact').find('.tel').text();
       var university = 'imperial';
       json.push({ fullName, researchInterest, title, readMoreLink, university, email, phoneNumber })
      });
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