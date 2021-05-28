const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')
const nodemailer = require("nodemailer");
require('dotenv').config()

const ListService = require("./services/list")
const ItemService = require("./services/item")
const UserAccountService = require("./services/useraccount")
const ShareService = require("./services/share")
const RoleService = require("./services/role")
const NotificationService = require("./services/notification")
const PaymentService = require("./services/payment")

const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // URLEncoded form data
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('dev')) // toutes les requêtes HTTP dans le log du serveur
app.use(cookieParser()) // read cookies (obligatoire pour l'authentification)

let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
    tls: { rejectUnauthorized: false }
});

let mailOptions = {
    from: 'fabien.esimed@gmail.com',
    to: 'fabien.marin84@gmail.com',
    subject: 'Testing and testing',
    text:'It works'
};

// const connectionString = "postgres://user:root@localhost/base"
const connectionString = "postgres://user:default1@base1.cz3tecgklrx1.us-east-1.rds.amazonaws.com"
const db = new pg.Pool({ connectionString: connectionString })
const listService = new ListService(db)
const itemService = new ItemService(db)
const userAccountService = new UserAccountService(db)
const shareService = new ShareService(db)
const roleService = new RoleService(db)
const notificationService = new NotificationService(db)
const paymentService = new PaymentService(db)
const jwt = require('./jwt')(userAccountService)
require('./api/list')(app, listService, jwt)
require('./api/item')(app, itemService, jwt)
require('./api/useraccount')(app, userAccountService, notificationService,paymentService, jwt, transporter)
require('./api/share')(app, shareService, jwt)
require('./api/notification')(app, notificationService, jwt)
require('./api/payment')(app, paymentService, jwt)
require('./datamodel/seeder')(userAccountService,listService,itemService,shareService,roleService,notificationService,paymentService)
    .then(app.listen(3333))


