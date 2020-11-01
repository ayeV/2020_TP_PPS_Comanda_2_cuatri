const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
admin.initializeApp();

/**
* Here we're using Gmail to send 
*/
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lacomanda2020pps@gmail.com',
        pass: 'ayelen94'
    }
});

exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      
        // getting dest email by query string
        const dest = req.query.dest;
        const subject = req.query.subject;
        const html = req.query.html;

        const mailOptions = {
            from: 'La Comanda <lacomanda2020pps@gmail.com>',
            to: dest,
            subject: "Tu cuenta ha sido rechazada en La Comanda", // email subject
            html: `<p style="font-size: 16px;">Has sido rechazado!</p>
            <img src="https://firebasestorage.googleapis.com/v0/b/lacomanda-a3726.appspot.com/o/my_icon.png?alt=media&token=23f8d79d-e69a-40e0-a067-90ec83aa8aa4"/>
            <br />`
        };
  
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });    
});

exports.sendMail2 = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      
        // getting dest email by query string
        const dest = req.query.dest;
    
        const mailOptions = {
            from: 'La Comanda <lacomanda2020pps@gmail.com>',
            to: dest,
            subject: "Tu cuenta ha sido aceptada en La Comanda", // email subject
            html: `<p style="font-size: 16px;">Has sido aceptado!</p>
            <img src="https://firebasestorage.googleapis.com/v0/b/lacomanda-a3726.appspot.com/o/my_icon.png?alt=media&token=23f8d79d-e69a-40e0-a067-90ec83aa8aa4"/>
            <br />`
        };
  
        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });    
});

