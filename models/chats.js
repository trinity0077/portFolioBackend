const mongoose = require('mongoose'); 
// Importe le package mongoose pour utiliser ses fonctionnalités.

// Schéma de la partie message qui sera associé à chatmessage avec en clé étrangère l'objId user sous le nom de "author".
const messageSchema = mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, 
    // La propriété "author" est de type ObjectId et fait référence à un objet de la collection "users".
    content: String, 
    // La propriété "content" est de type String et contient le contenu du message.
    dateCreation: Date 
    // La propriété "dateCreation" est de type Date et contient la date de création du message.
});

// Schéma de la partie chat qui inclut une liste de messages.
const chatSchema = mongoose.Schema({
    author:[{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }], 
    // La propriété "author" est une liste d'objets de type ObjectId faisant référence à des objets de la collection "users".
    admin:[{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }], 
    // La propriété "admin" est une liste d'objets de type ObjectId faisant référence à des objets de la collection "users".
    participant:[{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }], 
    // La propriété "participant" est une liste d'objets de type ObjectId faisant référence à des objets de la collection "users".
    race: [{ type: mongoose.Schema.Types.ObjectId, ref: 'races' }], 
    // La propriété "race" est une liste d'objets de type ObjectId faisant référence à des objets de la collection "races".
    type: String, 
    // La propriété "type" est de type String et contient le type de chat.
    dateCreation: Date, 
    // La propriété "dateCreation" est de type Date et contient la date de création du chat.
    messages : [messageSchema] 
    // La propriété "messages" est une liste d'objets de type "messageSchema" qui contient les messages associés à ce chat.
});

const Chat = mongoose.model('chats', chatSchema); 
// Crée un modèle de Mongoose appelé "Chat" à partir du schéma "chatSchema" et le rend disponible pour une utilisation dans d'autres fichiers.

module.exports = Chat; 
// Exporte le modèle "Chat" pour une utilisation dans d'autres fichiers.