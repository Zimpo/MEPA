//express
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var path = require('path');

//config
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('public/config.json', 'utf-8'));

var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res)
{
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/', function(req, res)
{
  res.redirect('back');
});

//initialize database
const config2 = {
  username : 'postgres',
  database: 'ursidb',
  password : '',
  port: 5432
};
const pg = require('pg');
const pool = new pg.Pool(config2);
/*pool.connect(function (err, client, done) {
  if (err) {
      console.log("Can not connect to the DB" + err);
  }
  client.query('SELECT * FROM product', function (err, result) {
       done();
       if (err) {
           console.log(err);
       }
       else
       {
         console.log(result.rows[0]);
       }
  })
});
pool.end();*/


//socket
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket, pseudo)
{
  var vente = [];
  var user;
  socket.on('new_user', function(pseudo)
  {
    console.log("nouvelle utilisateur : ", pseudo);
    user = pseudo;
  });

  var request = require('ajax-request');
  var country;
  var capital;
  socket.on('new_country', function()
  {
    //connexion base de donnée
    pool.connect(function (err, client, done) {
      if (err) {
          console.log("Can not connect to the DB" + err);
      }
      var random = Math.floor(Math.random() * Math.floor(11));
      console.log(random);
      client.query('SELECT * FROM country where id=$1', [random], function (err, result) 
      {
           done();
           if (err) {
               console.log(err);
           }
           else
           {
             country = result.rows[0].name;
             var url = 'https://restcountries.eu/rest/v2/name/' + country;
            request(url, function(err, res, body) 
            {
              console.log(res.statusCode);
              if (err)
              {
                console.log(err);
              }
              else if (res.statusCode != 200)
              {
                socket.emit('new_country', { name: country, 
                capital: "not found" });
              }
              else
              {
                var tab = JSON.parse(body);
                tab.forEach(function (elt) {
                console.log(elt)
                capital = elt.capital;
                socket.emit('new_country', { country:country});
                });
              }
            });
            }
        });
    });
  });

  socket.on('new_capital', function(c)
  {
    console.log(c, capital)
    if (capital == c)
    {
      socket.emit('new_capital', { message: "Bonne réponse"});
    }
    else
    {
      socket.emit('new_capital', { message: "Mauvaise réponse : " + capital});
    }
  });

  socket.on('new_vente', function()
  {
    var total = 0; 
    vente.forEach(function(elt)
    {
        total = total + elt.price;
    });
    console.log(total);
    socket.emit('total', { price: total });
  });

  socket.on('historique', function()
  {
    pool.connect(function (err, client, done) {
      if (err) {
          console.log("Can not connect to the DB" + err);
      }
      client.query('SELECT * FROM profil', function (err, result) {
           done();
           if (err) {
            console.log(err);
          }
          else if (result.rows.length > 0)
          {
              for(var i = 0; i < result.rows.length; i++){
                console.log(result.rows[i]);
                var product = {
                name : result.rows[i].name,
                price : result.rows[i].price
                };
                socket.emit("new_article", product);  
            }
          }
        });
      });
  });

  socket.on('new_article', function(code)
  {
    console.log("code de l'article : ", code);
    //interroger la base de donné
    pool.connect(function (err, client, done) {
      if (err) {
          console.log("Can not connect to the DB" + err);
      }
      client.query('SELECT * FROM product WHERE code=$1', [code], function (err, result) {
           //done();
           if (err) {
               console.log(err);
           }
           else if (result.rows.length > 0)
           {
            console.log(result.rows[0]);
            var product = {
             name : result.rows[0].name,
             code : result.rows[0].code,
             price : result.rows[0].price,
             desc : result.rows[0].description//Appel API HERE
           };
           vente.push(product);
           //Add Historique
           pool.connect(function (err, client, done) {
           client.query('INSERT INTO profil values($1, $2, $3)',[user, product.name, product.price], function (err, result) {
                done();
                if (err) {
                  console.log(err);
                }
              });
            });
           //Send information to client
           socket.emit("new_article", product);  
           }
           else
           {
            console.log("Resultat not found for the code : " + code);
            socket.emit('new_msg', { user: "Erreur sur le code", 
            content: code});
           }
      })
    });
  });
});

server.listen(config.port);