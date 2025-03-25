const express = require('express');
const { Resend } = require('resend');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);


// email de prise de comptact via le site
router.post('/send', async (req, res) => {
  try {
    const { email, subject, message, gdprConsent } = req.body;

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev', // Doit être un domaine vérifié chez Resend
      to: 'gryspeerdt.camille@gmail.com', // Email du client
      subject: `Email recu de ${email}, sur le sujet de :${subject}`, 
      text: `Email de ${email}, message : ${message}, GRPD : ${gdprConsent}`, //message 
    });

    // Réponse pour confirmer l'envoi
    res.json({ success: true, message: 'Email envoyé', response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});





//email de prise de comptact via le site avec reponse, 
// impossible avec resend free account
// router.post('/send', async (req, res) => {
//   try {
//     const { email, subject, message, gdprConsent} = req.body;

//     console.log("📩 Envoi de l'email principal...");
//     const sendResponse = await resend.emails.send({
//       from: 'onboarding@resend.dev',
//       to: 'gryspeerdt.camille@gmail.com',
//       subject: `Email reçu de ${email} sur le sujet : ${subject}`,
//       text: message,
//     });

//     console.log("Réponse de Resend pour l'email principal :", sendResponse);

//     if (!sendResponse || !sendResponse.data || !sendResponse.data.id) {
//       throw new Error("Erreur lors de l'envoi du premier email.");
//     }

//     const emailId = sendResponse.data.id;

//     console.log("📨 Envoi de la réponse automatique...");
//     const autoReplyResponse = await resend.emails.send({
//       from: 'onboarding@resend.dev',
//       to: email,
//       subject: `Confirmation de réception - ${subject}`,
//       text: `Bonjour, \n\nJ'ai bien reçu votre message et je vous remerci. \n\n📌 Référence : ${emailId} \n\nJe reviendrais vers vous dès que possible.\n\nCordialement,\nCamille Gryspeerdt`,
//     });

//     console.log("Réponse de Resend pour l'email automatique :", autoReplyResponse);

//     res.json({ success: true, message: 'Email et confirmation envoyés', emailId });

//   } catch (error) {
//     console.error("Erreur lors de l'envoi de l'email :", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

module.exports = router;
