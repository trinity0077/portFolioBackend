const express = require('express');
const { Resend } = require('resend');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/send-email", async (req, res) => {
    const { email, subject, message } = req.body;

    try {
        // Email vers toi
        await resend.emails.send({
            from: "contact@ton-domaine.com",
            to: "ton-email@gmail.com",
            subject: `Nouveau message de ${email} - ${subject}`,
            html: `<p>${message}</p>`,
        });

        // Email automatique de confirmation
        await resend.emails.send({
            from: "contact@ton-domaine.com",
            to: email,
            subject: "Votre message a bien été reçu !",
            html: `<p>Merci pour votre message. Je vous répondrai dès que possible.</p>`,
        });

        res.status(200).json({ success: true, message: "Emails envoyés !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur d'envoi d'email" });
    }


});

router.post('/test', async (req, res) => {
    try {
      const { email, subject, message } = req.body;
  
      const response = await resend.emails.send({
        from: 'onboarding@resend.dev', // Doit être un domaine vérifié chez Resend
        to: 'gryspeerdt.camille@gmail.com', // Email du client
        subject: `Email recu de ${email}, sur le sujet de :${subject}`,
        text: `${message}, <= variable message surement vide `,
      });
  
      // Réponse pour confirmer l'envoi
      res.json({ success: true, message: 'Email envoyé', response });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

module.exports = router;
