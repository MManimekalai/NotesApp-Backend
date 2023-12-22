const nodemailer = require('nodemailer')
require('dotenv').config()

const MailSender = ({data}) => {
    //Creating transport
    let sender=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.emailID,
            pass:process.env.Passkey
        }
    });
    let reciever=data.email;
    let subject=data.subject;
    let message=data.message;
    let from={
        name:"Note Taking App",
        address:process.env.emailID
    }
    //mail content
    let mailContent={
        from:from,
        to:reciever,
        subject:subject,
        text:message,
    };
    sender.sendMail(mailContent,function(error,info){
        if(error){
            console.log("Error in sending mail",error);
            return false;
        }
    })
    return true;

}

module.exports = MailSender