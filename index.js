var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
    const testUrl = 'https://www.lancaster.ac.uk/search/?collection=lancaster-meta&query=computer&tab=people&start_rank=11';

    url = 'http://www.imdb.com/title/tt1229340/';
    
    request(testUrl, function(error, response, html){
        console.log('===> ', html);

        if(!error){
            var $ = cheerio.load(html);
    
            var json = [];
        
            $('.staff-details').filter(function(){
                var data = $(this);
                fullName = data.children().first().text();
                title = data.children('job-title').text();
                specialization = data.children().last().children().text();
                phoneNumber = data.children().last().children().text();

        
                json.push({ fullName, title, specialization, phoneNumber });

            })
        
            $('.star-box-giga-star').filter(function(){
                var data = $(this);
                rating = data.text();
        
                json.rating = rating;
            })
        }
    
    // To write to the system we will use the built in 'fs' library.
    // In this example we will pass 3 parameters to the writeFile function
    // Parameter 1 :  output.json - this is what the created filename will be called
    // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
    // Parameter 3 :  callback function - a callback function to let us know the status of our function
    
    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
    
        console.log('File successfully written! - Check your project directory for the output.json file');
    
    })
    
    // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
    res.send('Check your console!')
    
        }) ;
    })

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;