//express
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var path = require('path');
var fs = require('fs');

//config
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('public/config.json', 'utf-8'));
var fs = require('fs');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res){res.sendFile(path.join(__dirname + '/index.html'));});
app.post('/', function(req, res){res.redirect('back');});

//initialize database
const config2 = {
	username : 'postgres',
	database: 'ursidb',
	password : '',
	port: 5432
  };
  
const { Pool } = require('pg')
const pool = new Pool(config2)

//read file

		
		
			pool.connect(function (err, client, done) {
				if (err) {
					console.log("Can not connect to the DB" + err);
				}
				var list;
				fs.readFile('./products.json', 'utf-8', function (err, text2) {
					if (err) 
						throw err;
					else 
					{
						list = JSON.parse(text2);
					}
					console.log(list);
					
					for (var i = 0; i < list.length; i++)
					{
					console.log("row " + i);
					var query = {
						text: 'INSERT INTO product(id, name, code, price, description) VALUES($1, $2, $3, $4, $5)',
						values: [list[i][0], list[i][1],list[i][2],list[i][3], list[i][4]]};
					
					
					client.query(query, function (err, result) {
					//done();
					if (err)
						console.log(err);
					else
					console.log(true); });
					
					console.log(query);
					
				}
					
				});
				
			});
pool.end();
server.listen(config.port);