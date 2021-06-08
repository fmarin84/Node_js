const bcrypt = require('bcrypt')
const UserAccountDAO = require('../datamodel/useraccountdao')
const UserAccount = require('../datamodel/useraccount')
const nodemailer = require("nodemailer");

module.exports = class UserAccountService {
    constructor(db) {
        this.dao = new UserAccountDAO(db)
    }

    async isValide(login){
        //const user =  Object.assign(new UserAccount(), await this.dao.getByLogin(login))
        const user = await this.dao.getByLogin(login)
        return user.isactived
    }

    async insert(displayname,login,password,isactived,jwt=null){
        if(isactived){
            return this.dao.insert(new UserAccount(displayname,login,this.hashPassword(password),isactived))
        }
        else{
            if(this.dao.insert(new UserAccount(displayname,login,this.hashPassword(password),isactived))){
                await this.sendMail(login,jwt)
                return true
            }
        }
        return false
    }

    async sendMail(login,jwt){
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: 'fabien.esimed@gmail.com',
                pass: 'Esimed123*'
            },
            tls: { rejectUnauthorized: false }
        });

        let lien="http://ec2-23-20-194-1.compute-1.amazonaws.com/authentication.html?token="+jwt.generateLienValidation(login)

        let info = await transporter.sendMail({
            to: login,
            subject: "Inscription [ESIMED NODEJS]",
            html: "Bonjour,<br>Pour confirmer votre inscription<br>Cliquez ici : <a href='"+lien+"'>"+lien+"</a>",
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    updatePwd(user) {
        user.challenge = this.hashPassword(user.challenge)
        return this.dao.updatePwd(user)
    }

    async validateLogin(login) {
        const user =  Object.assign(new UserAccount(), await this.dao.getByLogin(login.trim()))
        if((user.login === login) || (user.login === undefined)){
            return false
        }
        return true
    }
    async validatePassword(login, password) {
        const user =  Object.assign(new UserAccount(), await this.dao.getByLogin(login.trim()))

        if(user.isactived === false ){
            return false
        }
        return this.comparePassword(password, user.challenge)
    }
    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash)
    }
    hashPassword(password) {
        return bcrypt.hashSync(password, 10)  // 10 : cost factor -> + élevé = hash + sûr
    }
    async validatePasswordEncrypt(login, password) {
        const user =  Object.assign(new UserAccount(), await this.dao.getByLogin(login.trim()))

        if(password === user.challenge ){
            return true
        }
        return false
    }
}