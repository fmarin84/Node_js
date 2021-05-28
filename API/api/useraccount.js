const Notification = require('../datamodel/notification')

module.exports = (app, svc, svcNotification,svcPayment, jwt, transporter) => {
    app.post('/useraccount/authenticate', (req, res) => {
        const { login, password } = req.body
        if ((login === undefined) || (password === undefined)) {
            res.status(400).end()
            return
        }

        svc.isValide(login)
            .then(valid => {
                if (!valid) {
                    res.status(400).end()
                    return
                }
            })
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })

        svc.validatePassword(login, password)
            .then(authenticated => {
                if (!authenticated) {
                    res.status(401).end()
                    return
                }
                res.json({'token': jwt.generateJWT(login)})
            })
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.post('/useraccount/sendEmailSubscrib', async (req, res) => {
        const login = req.body.login

        const user = await svc.dao.getByLogin(login)
            .then()
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })

        if(user !== undefined){

            const payement = await svcPayment.dao.getByUserId(user.id)
                .then()
                .catch(e => {
                    console.log(e)
                    res.status(500).end()
                })

            const html = `Bonjour,<br> Félicitation vous etes inscrit sur notre site listedecousre.fr <br>Commande effectuer le ${payement.created_at} au nom de : ${payement.nom}${payement.prenom} pour le compte de ${user.displayname}`

            let mailOptions = {
                from: 'fabien.esimed@gmail.com',
                to: login,
                subject: "Abonnement",
                html: html

            };

            transporter.sendMail(mailOptions, function(err, data) {
                if(err){
                    console.log('Error Occurs')
                } else {
                    console.log(login)
                    console.log(lien)
                    console.log('Email sent !!')
                }
            });

        }

    })

    app.post('/useraccount/sendEmailForgetPwd', async (req, res) => {
        const login = req.body.login

        const user = await svc.dao.getByLogin(login)
            .then()
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })

        if(user !== undefined){

            let lien="http://localhost:63342/Node_js/front/forgetpassword.html?token="+jwt.generateLinkForgetPwd(login)

            let mailOptions = {
                from: 'fabien.esimed@gmail.com',
                to: login,
                subject: "Mot de passe oublié",
                html: "Bonjour,<br>Voici votre lien pour la réinitialisation votre mot de passe. <br>Cliquez ici : <a href='"+lien+"'>"+lien+"</a>",

            };

            transporter.sendMail(mailOptions, function(err, data) {
                if(err){
                    console.log('Error Occurs')
                } else {
                    console.log(login)
                    console.log(lien)
                    console.log('Email sent !!')
                }
            });

        }

    })

    app.get("/useraccount/search/:login", jwt.validateJWT, async (req, res) => {
        res.json(await svc.dao.getUserByLogin(req.params.login, req.user.id))
    })

    app.get("/useraccount/search/:login/:isAbonne", jwt.validateJWT, async (req, res) => {
        if((req.params.login === "azeorihalkzedniuazgduhfrebejhzrfgzyedziuefjbnozisdjsqokdj") && (req.params.isAbonne === "true")){
            res.json(await svc.dao.getUsersByAbonne())
        }else if (req.params.isAbonne === "true"){
            res.json(await svc.dao.getUserByLoginAbonne(req.params.login, req.user.id))
        } else {
            res.json(await svc.dao.getUserByLogin(req.params.login, req.user.id))
        }
    })

    app.get("/useraccount", jwt.validateJWT, async (req, res) => {
        res.json(await svc.dao.getById(req.user.id))
    })

    app.get("/useraccount/users", jwt.validateJWT, async (req, res) => {
        res.json(await svc.dao.getAll())
    })

    app.get("/useraccount/roleuser/:userId", jwt.validateJWT, async (req, res) => {
        res.json(await svc.dao.getRoleByUser(req.params.userId))
    })

    app.get("/useraccount/rolenotuser/:userId", jwt.validateJWT, async (req, res) => {
        res.json(await svc.dao.getNotRoleByUser(req.params.userId))
    })

    app.get("/useraccount/:id", jwt.validateJWT, async (req, res) => {
        try {
            const user = await svc.dao.getById(req.params.id)
            if (user === undefined) {
                return res.status(404).end()
            }

            if(await svc.dao.isAdmin(req.user.id) !== []){
                return res.json(user)
            }

            if (user.id !== req.user.id) {
                return res.status(403).end()
            }

            return res.json(user)
        } catch (e) { res.status(400).end() }
    })

    app.put("/useraccount", jwt.validateJWT, async (req, res) => {
        const user = req.body
        if ((user.id === undefined) || (user.id == null) ) {
            return res.status(400).end()
        }
        const prevUser = await svc.dao.getById(user.id)

        if (prevUser  === undefined) {
            return res.status(404).end()
        }

        if ( (await svc.dao.isAdmin(req.user.id) === [] ) && (prevUser.id !== req.user.id) ) {
            return res.status(403).end()
        }
        svc.dao.update(user)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.post("/useraccount/forget",jwt.validateLienPassword,async (req,res)=>{
        try{
            const  {token, password} = req.body
            if((token ===undefined) || (password === undefined)){
                res.status(400).end()
                return
            }

            req.user.challenge=svc.hashPassword(password)
            if(await svc.dao.update(req.user)){
                res.status(200).end()
            }
            else{
                res.status(404).end()
            }
        }
        catch (e) {
            console.log(e)
            res.status(500).end()
        }
    })


    app.put("/useraccount/password", async (req, res) => {
        const oldUser = req.body
        if ((oldUser.id === undefined) || (oldUser.id == null) ) {
            return res.status(400).end()
        }
        const prevUser = await svc.dao.getById(oldUser.id)

        if (prevUser  === undefined) {
            return res.status(404).end()
        }
        if (prevUser.id !== oldUser.id) {
            return res.status(403).end()
        } else {
            svc.validatePassword(prevUser.login, oldUser.old)
                .then(authenticated => {
                    if (!authenticated) {
                            res.status(401).end()
                            return
                    } else{
                        prevUser.challenge = oldUser.challenge
                        svc.updatePwd(prevUser)
                            .then(res.status(200).end())
                            .catch(e => {
                                console.log(e)
                                res.status(500).end()
                            })
                    }

                })
                .catch(e => {
                    console.log(e)
                    res.status(500).end()
                })
        }

    })


    app.post("/useraccount/inscription",async (req,res)=>{
        const  {login, password,pseudo} = req.body
        if((login ===undefined) || (password === undefined) || (pseudo===undefined)){
            res.status(400).end()
            return
        }

        let user = await svc.dao.getByLogin(login)
        if(user!==undefined){
            res.status(401).end()
            return
        }

        await svc.validateLogin(login)
            .then(isRegister => {
                if (isRegister) {
                    res.status(401).end()
                    return
                }

                if (!isRegister) {
                  svc.insert(pseudo, login, password, false, jwt)
                        .then(res.status(200).end() )
                        .catch(e=>{
                            console.log(e)
                            res.status(400).end()
                        })
                        .catch(e => {
                            console.log(e)
                            res.status(500).end()
                        })
                }

            })
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.get("/useraccount/sendMail/:id", async (req,res)=>{
        let login= req.params.id
        await svc.sendMail(login,jwt).then(res.status(200).end())
            .catch(e=>{
                console.log(e)
                res.status(400).end()
            })
    })

    app.get("/useraccount/token/:id",jwt.validateLienInscription, async (req,res)=>{
        try{
            if(req.user!== undefined){
                req.user.isactived=true
                if(await svc.dao.update(req.user)){
                    if(await svc.isValide(req.user.login)){

                        await svcNotification.dao.insert(new Notification('Bienvenue', 'Bienvenue sur le site liste de course', false, req.user.id))
                        res.json({'login': jwt.generateJWT(req.user.login)})
                        res.status(200).end()
                    }
                    else{
                        res.status(404).end()
                    }
                }
                else{
                    res.status(401).end()
                }
            }
            else{
                res.status(404).end()
            }
        }
        catch (e) {
            console.log(e)
            res.status(500).end()
        }

    })



    app.delete("/useraccount/delete/role_user/:userId/:roleId", jwt.validateJWT, async (req, res) => {
        svc.dao.deleteRoleUser(req.params.userId, req.params.roleId)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.post("/useraccount/add/role_user/:userId/:roleId", jwt.validateJWT, async (req, res) => {
        svc.dao.addRoleUser(req.params.userId, req.params.roleId)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

}