const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')

const ListService = require("./services/list")
const ItemService = require("./services/item")
const UserAccountService = require("./services/useraccount")
const ShareService = require("./services/share")

const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // URLEncoded form data
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('dev')); // toutes les requêtes HTTP dans le log du serveur
app.use(cookieParser()) // read cookies (obligatoire pour l'authentification)

const connectionString = "postgres://user:root@localhost/base"
const db = new pg.Pool({ connectionString: connectionString })
const listService = new ListService(db)
const itemService = new ItemService(db)
const userAccountService = new UserAccountService(db)
const shareService = new ShareService(db)
const jwt = require('./jwt')(userAccountService)
require('./api/list')(app, listService,itemService, jwt)
require('./api/item')(app, itemService, jwt)
require('./api/useraccount')(app, userAccountService, jwt)
require('./api/share')(app, shareService, jwt)
require('./datamodel/seeder')(userAccountService,listService,shareService)
    .then(app.listen(3333))


