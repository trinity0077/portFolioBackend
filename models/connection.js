const mongoose = require('mongoose'); 
// Importe le package mongoose pour utiliser ses fonctionnalités.

mongoose.set('strictQuery', false); 
// Désactive le mode "strict" pour les requêtes MongoDB.
//permet de faire des requêtes plus flexibles sur la base de données.

const connectionString = process.env.CONNECTION_STRING;

// Récupère l'URL de connexion à la base de données MongoDB à partir de la variable d'environnement "CONNECTION_STRING".

// Établit une connexion à la base de données MongoDB à l'aide de l'URL de connexion et des options de connexion spécifiées.
mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected')) 
  // Affiche un message dans la console si la connexion est établie avec succès.
  .catch(error => console.error(error)); 
  // Affiche un message d'erreur dans la console si la connexion échoue.