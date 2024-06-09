import sgMail from "@sendgrid/mail";


/**
 * Invia un'email per il reset della password.
 * @param {string} emailUtente - L'indirizzo email del destinatario.
 * @param {string} resetLink - Il link per il reset della password.
 */
async function sendResetPasswordMail(emailUtente, resetLink) {

    // Imposta la chiave API di SendGrid in modo sicuro utilizzando una variabile d'ambiente
    const SendGridApiKey = process.env.SENDGRID_API_KEY;
    sgMail.setApiKey(SendGridApiKey);
  
    const resetMail = {
        to: emailUtente,
        from: 'trengo.mailservices@gmail.com',
        subject: 'TrenGo: Reset Your Password Now',
        text: `
        Hello!
        
        We noticed that you requested a password reset for your TrenGo account. If this wasn't you, no action is required.
        
        To reset your password, please follow this secure link:
        
        ${resetLink}
        
        Please note that this link is valid for the next 24 hours. If you don't reset your password within this period, you'll need to request a new link.
        
        Safe travels,
        The TrenGo Team
        `,
        html: `
        <strong>Hello!</strong><br><br>
        
        <p>We noticed that you requested a password reset for your TrenGo account. If this wasn't you, no action is required.</p>
        
        <p>To reset your password, please follow this secure link:</p>
        
        <a href="${resetLink}" style="color: #ffffff; background-color: #007bff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a><br><br>
        
        <p>This link is valid for the next 24 hours. If you don't reset your password within this period, you'll need to request a new link.</p>
        
        <p>Safe travels,</p>
        <p>The TrenGo Team</p>
        `,
    };
    try {
        await sgMail.send(resetMail);
        console.log('Email per il reset della password inviata con successo!');
    } catch (error) {
        console.error('Ops! C\'è stato un problema nell\'invio dell\'email per il reset della password:', error);
    }
}


export{
    sendResetPasswordMail
}