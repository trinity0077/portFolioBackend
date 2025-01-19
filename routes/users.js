var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const Race = require("../models/races");
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");

// 3 const pour la sauvegarde de la photo
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const uniqid = require('uniqid');


// Inscription // checkbody full   (!checkBody(req.body, ["firstname", "username", "email", "password", "age", "gender",]))
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["username", "password",])) {
    console.log(req.body,'SingnupBackend au checkbody')
    res.json({ result: false, error: "Missing or empty fields de signUP ERROR 1" });
    return;
  }
  // Check if the user has not already been registered
  User.findOne({
    username: { $regex: new RegExp(req.body.username, "i") }, // force l'email en minuscule.
  }).then((data) => {
    console.log(data)
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10); // Hash réalisé sur le mot de passe avec un nombre de tours (coût) 
      const newUser = new User({
        username: req.body.username,
        password: hash,
        cigaretteprice:0.6,
        smokeCigarettes: [],
        notSmokeCigarettes: [],
        token: uid2(32),
        dateCreation: Date.now(),
      });
      newUser.save().then((dataBase) => {
        res.json({ result: true, token: dataBase.token, username: dataBase.username, dateCreation: dataBase.dateCreation, cigaretteprice: dataBase.cigaretteprice  });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

// Connexion
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields de signIN ERROR 2" });
    return;
  }

  User.findOne({ username: { $regex: new RegExp(req.body.username, "i") } }).then(
    (data) => {
      if (data !== null && bcrypt.compareSync(req.body.password, data.password)) {
        res.json({
          result: true,
          token: data.token,
          dateCreation: data.dateCreation,
          cigaretteprice:data.cigaretteprice,
          firstname: data.firstname,
          username: data.username,
          // email: data.email,
          image: data.image,
          age: data.age,
          gender: data.gender,
        });
      } else {
        res.json({ result: false, error: "User not found or wrong password" });
      }
    }
  );
});

//route pour modifier le prix d'une cigarette
// Route pour modifier le prix d'une cigarette
router.post("/updatecigaretteprice/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPrice } = req.body;  // Le nouveau prix de la cigarette

    // Recherche de l'utilisateur par son token
    const user = await User.findOne({ token });

    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }

    // Validation du nouveau prix
    if (isNaN(newPrice) || newPrice <= 0) {
      return res.json({ result: false, error: "Invalid price" });
    }
// console.log(newPrice)
    // Mise à jour du prix de la cigarette
    user.cigaretteprice = newPrice;

    // Sauvegarde des modifications de l'utilisateur
    await user.save();

    return res.json({ result: true, message: "Cigarette price updated successfully" });
  } catch (error) {
    console.error(error);
    return res.json({ result: false, error: "Failed to update cigarette price" });
  }
});


// route pour obtenir les info cigarettes

router.get("/addsmokecigarettes/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Recherche de l'utilisateur par son token
    const user = await User.findOne({ token });

    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }

    // Ajout d'une nouvelle cigarette au tableau
    const newCigarette = {
      smokedCig: 1,
      dateSmoked: new Date(),
    };
    user.smokeCigarettes.push(newCigarette);

    console.log(newCigarette)
    // Sauvegarde des modifications de l'utilisateur
    await user.save();

    
    return res.json({ result: true, message: "Cigarette added successfully" });
  } catch (error) {
    console.error(error);
    
    return res.json({ result: false, error: "Failed to add cigarette" });
  }
});


router.delete("/deletesmokecigarettes/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Recherche de l'utilisateur par son token
    const user = await User.findOne({ token });

    if (!user) {
      
      return res.json({ result: false, error: "User not found" });
    }

    // Vérification s'il y a des cigarettes fumées
    if (user.smokeCigarettes.length === 0) {
      
      return res.json({ result: false, error: "No cigarettes smoked" });
    }

    // Suppression de la dernière cigarette fumée du tableau
    user.smokeCigarettes.pop();

    // Sauvegarde des modifications de l'utilisateur
    await user.save();
    
    return res.json({ result: true, message: "Last cigarette removed successfully" });
  } catch (error) {
    console.error(error);
    
    return res.json({ result: false, error: "Failed to remove last cigarette" });
  }
});



router.get("/addnotsmokecigarettes/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Recherche de l'utilisateur par son token
    const user = await User.findOne({ token });

    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }

    // Ajout d'une nouvelle cigarette au tableau
    const newNoCigarette = {
      notSmokedCig: 1,
      datenotSmoked: new Date(),
    };
    user.NotSmokedcigarettes.push(newNoCigarette);

    // Sauvegarde des modifications de l'utilisateur
    await user.save();

    return res.json({ result: true, message: "NotSmokedcigarette added successfully" });
  } catch (error) {
    console.error(error);
    return res.json({ result: false, error: "Failed to add NotSmokedcigarette" });
  }
});


router.delete("/deletenotsmokecigarettes/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Recherche de l'utilisateur par son token
    const user = await User.findOne({ token });
    
    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }

    // Vérification s'il y a des cigarettes fumées
    console.log(user.NotSmokedcigarettes.length)
    if (user.NotSmokedcigarettes.length === 0) {
      return res.json({ result: false, error: "No NotSmokedcigarette to delete" });
    }

    // Suppression de la dernière cigarette fumée du tableau
    user.NotSmokedcigarettes.pop();

    // Sauvegarde des modifications de l'utilisateur
    await user.save();

    return res.json({ result: true, message: "Last NotSmokedcigarette removed successfully" });
  } catch (error) {
    console.error(error);
    return res.json({ result: false, error: "Failed to remove last NotSmokedcigarette" });
  }
});
  

router.get("/datasmoke/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Recherche de l'utilisateur par son token
    const user = await User.findOne({ token });

    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }

    const userDataSmoke = user.smokeCigarettes.map((cigarette) => ({
      smokedCig: cigarette.smokedCig,
      dateSmoked: cigarette.dateSmoked,
    }));

    const userDataNotSmoked = user.NotSmokedcigarettes.map((cigarette) => ({
      notSmokedCig: cigarette.notSmokedCig,
      datenotSmoked: cigarette.datenotSmoked,
    }));

    return res.json({ result: true, userDataSmoke, userDataNotSmoked });
  } catch (error) {
    console.error(error);
    return res.json({ result: false, error: "Failed to find data for this user" });
  }
});




//  route pour envoyer l'image à cloudinary et récupérer l'url de l image en front
router.post('/upload', async (req, res) => {

  let id = uniqid() // generation d'un nom unique avec le module uniqid + argument possible ex : uniqid('user')
  // ce qui ajoute un prefixe devant la chaine de caratere 
  
  const photoPath = `/tmp/${id}.jpg`; // accès au fichier temporaire de vercel /tmp/ et un id aléatoire en .jpg
  const resultMove = await req.files.photoFromFront.mv(photoPath); // move the photo sent in the request to the temporary file
  if (!resultMove) { // if the photo was successfully moved

    const resultCloudinary = await cloudinary.uploader.upload(photoPath); // upload the photo to Cloudinary

    fs.unlinkSync(photoPath); // delete the temporary file
    console.log('response from Cloudinary', resultCloudinary);
    res.json({ result: true, image: resultCloudinary.secure_url }); // send a response with the Cloudinary secure url of the uploaded image
  } else { 
    res.json({ result: false, error: resultMove }); 
  }
});




// PUT pour modifier le profil
router.put('/changesprofil', (req, res) => {
  User.findOne({ token: req.body.token }).then(user => {
    if (user === null) {
      res.json({ result: false, error: 'User not found' });
      return;
    }
    const updatedFields = {
      firstname: req.body.firstname,
      username: req.body.username,
      email: req.body.email,
      image: req.body.image,
    };
    const filter = { token: req.body.token };
    User.updateOne(filter, updatedFields)
      .then(() => {

        res.json({ result: true, msg: 'Mise à jour réussie' });
      })
  });
});

// PUT pour modifier le profil
router.put('/changesimageprofil', (req, res) => {
  User.findOne({ token: req.body.token }).then(user => {
    if (user === null) {
      res.json({ result: false, error: 'User not found' });
      return;
    }
    const updatedFields = {
      image: req.body.image,
    };
    const filter = { token: req.body.token };
    User.updateOne(filter, updatedFields)
      .then(() => {

        res.json({ result: true, msg: 'Mise à jour réussie' });
      })
  });
});

// GET  pour renvoyer la liste des participants à une course
router.get('/add/:token', (req, res) => {
  console.log('req.paramas.token', req.params.token);
  if (!req.params.token) {
    res.json({ result: false, error: 'Missing or empty fields de add/token ERROR 3' });
    return;
  }
  User.findOne({ token: req.params.token }).then((user) => {
    //console.log('userdata', user);
    let idUser = '';
    if (user === null) {
      res.json({ result: false, error: 'User not found2' });
      return;
    } else {
      idUser = user._id;
      //console.log(user._id);
    }
    // on utilise l'opérateur $elemMatch pour rechercher dans le tableau des participants de la collection "Race" l'élément qui est égal à la valeur de "idUser"
    Race.find({
      $or: [
        { author: idUser },
        { participants: { $elemMatch: { $eq: idUser } } },
      ],
      
      
    })
      .populate('author', ['username', 'image'])
      .populate('participants', ['username'])
      .sort({ date: 'asc' }) // Classe les résultats par ordre croissant de date
      .then((races) => {
        console.log('races où participe l user', races);
        if (!races) {
          res.json({ result: false, error: 'Races not found' });
          return;
        }
        const formattedRaces = races.map((race) => {
          // Formate les participants sous la forme "@username1, @username2" via le map
          const formattedParticipants = race.participants
            .map((participant) => `@${participant.username}`)
            .join(', ');
          return { ...race.toObject(), participants: formattedParticipants };
        });
        res.json({ result: true, races: formattedRaces });
      });
  });
});

module.exports = router;
