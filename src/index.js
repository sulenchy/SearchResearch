var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var MiniSearch = require('minisearch');
var documents = require('./output.json');
var dotenv = require('dotenv');
var path = require('path');
var app = express();

dotenv.config();

app.use('/static', express.static(path.join(__dirname, '../public')))

app.get('/scrape', function (req, res) {

  var lancasterList = [];
  var imperialList = [];
  var coventryList = [];

  var lancasterUrl = 'https://www.lancaster.ac.uk/search/?collection=lancaster-meta&query=computer&tab=people';
  
  var imperialUrl = 'https://www.imperial.ac.uk/computing/people/academic-staff/';

  var coventryUrl = 'https://www.coventry.ac.uk/life-on-campus/staff-directory/?filters=1187';

  request(lancasterUrl, function (error, response, html) {

    if (!error) {
      var $ = cheerio.load(html);

      $('.people').find('li').each(function (index, element) {
        var fullName = $(element).find('.staff-details').find('h2').find('a').text();
        var title = $(element).find('.staff-details').find('.job-title').text();
        var phoneNumber = $(element).find('.staff-contact').find('.details-list__tel').find('a').text();
        var department = $(element).find('.staff-contact').find('.details-list__location').text();
        var readMoreLink = $(element).find('.staff-details').find('h2').find('a').attr('href');
        var researchInterest = '';
        var university= 'lancaster';

        lancasterList.push({ fullName, title, phoneNumber, department, readMoreLink, university, researchInterest });
      })
    }
  });

  // get professor's info in imperial
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

       imperialList.push({ fullName, researchInterest, title, readMoreLink, university, email, phoneNumber })
      });
    }
  });

  request(coventryUrl, function (error, response, html) {

    if (!error) {
      var $ = cheerio.load(html);

      $('div[class="container ptm"]').find('.row').each(function (index, element) {
       var fullName = $(element).find('.col-sm-12').find('h4').find('a').text();
       var researchInterest = $(element).find('.col-sm-12').find('.research-centre').text();
       var readMoreLink = 'https://www.coventry.ac.uk' + $(element).find('.col-sm-12').find('h4').find('a').attr('href');
       var title = $(element).find('.col-sm-12').find('p').eq(-2).text().split('|')[0];

       var email =  $(element).find('.col-sm-12').find('p').eq(-2).find('a').attr('href');
       email = email && email.split(':')[1];
       var university = 'coventry';

       coventryList.push({ fullName, readMoreLink, university, researchInterest, title, email })
      });
    }

    fs.writeFile('output.json', JSON.stringify([...lancasterList, ...imperialList, ...coventryList], null, 4), function (err) {

      console.log('File successfully written! - Check your project directory for the output.json file');

    })
    res.send('Check your console!');
  });
  
})

app.get('/search/:query', function(req, res) {
  var miniSearch = new MiniSearch({
    idField: 'researchInterest',
    fields: [ 'phoneNumber', 'fullName', 'researchInterest', 'university', 'readMoreLink' ],
    storeFields: [ 'phoneNumber', 'fullName', 'researchInterest', 'university', 'readMoreLink' ],
    searchOptions: {
      boost: { fullName: 2 },
      fuzzy: 0.2
    }
  })
  miniSearch.addAll(documents)
   
  // It will now by default perform fuzzy search and boost "title":
  var result = miniSearch.search(req.params.query)
  res.send(result)
})

app.listen(process.env.PORT)
console.log(`Magic happens on port ${ process.env.PORT }`);
exports = module.exports = app;