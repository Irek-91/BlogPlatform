import nodemailer from 'nodemailer'

export const emailAdapter = {
    async sendEmail(email: string, subject: string, code: string) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
            user: 'shamilov.irek.back@gmail.com',
            pass: 'pxaubouunpscxztw'
            }
        });


        await transporter.sendMail({
            from: '"Irek " <shamilov.irek.back@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            // text: message, // plain text body
            html: `<h1>Thank for your registration</h1> <p>To finish registration please follow the link below: <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a> </p>`
        })
        
    },

    async passwordRecovery(email: string, subject: string, code: string) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
            user: 'shamilov.irek.back@gmail.com',
            pass: 'pxaubouunpscxztw'
            }
        });


        await transporter.sendMail({
            from: '"Irek " <shamilov.irek.back@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            // text: message, // plain text body
            html: `<h1>Password recovery</h1> <p>To finish password recovery please follow the link below:<a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a> </p>`
            
            })
        
    }
    
}
