const mongoose = require('mongoose');

const raceSchema = mongoose.Schema({
    author:{ type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    admin:{ type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    participants:[{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    maxParticipants: Number,
    description: String,
    type: String,
    date: Date,
    address: String,
    latitude:Number,
    longitude:Number,
    duration:Number,
    distance:Number,
    level:String,
    dateCreation: Date,
    //token: String,
  });
const Race = mongoose.model('races', raceSchema);

module.exports = Race;
