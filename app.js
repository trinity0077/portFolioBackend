require('dotenv').config(); // permet de charger les variables d'environnement depuis un fichier .env.



/*Les 4 lignes suivantes importent les modules nécessaires et créent une instance d'application Express : */
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/users');
var racesRouter = require('./routes/races');
var chatsRouter = require('./routes/chats');

var app = express();

const fileUpload = require('express-fileupload');
app.use(fileUpload());

const cors = require('cors');
app.use(cors());
/*Le module cors est utilisé pour activer la politique Cross-Origin Resource Sharing (CORS),
 qui permet aux serveurs de restreindre l'accès des ressources d'un site web à des domaines
  ou des protocoles spécifiques.*/

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*Les middlewares logger, express.json(), express.urlencoded(), cookieParser, express.static() 
sont ensuite ajoutés à l'application pour gérer les requêtes HTTP entrantes. */



app.use('/users', usersRouter);
app.use('/races', racesRouter);
app.use('/chats', chatsRouter);

module.exports = app;
