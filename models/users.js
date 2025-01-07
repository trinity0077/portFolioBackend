const mongoose = require("mongoose");

const smokecigarettesSchema = mongoose.Schema({
  smokedCig: Number,
  dateSmoked: Date,
});

const notSmokedcigarettesSchema = mongoose.Schema({
  notSmokedCig: Number,
  datenotSmoked: Date,
});

const userSchema = mongoose.Schema({
  firstname: String,
  username: String,
  email: String,
  image: String,
  password: String,
  age: Date,
  gender: String,
  dateCreation: Date,
  followedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  token: String,
  smokeCigarettes: [smokecigarettesSchema], // Utilisation du schéma des cigarettes fumées comme sous-document
  NotSmokedcigarettes: [notSmokedcigarettesSchema]
});

const User = mongoose.model("users", userSchema);

module.exports = User;
