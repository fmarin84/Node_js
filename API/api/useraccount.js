module.exports = (app, svc, jwt, transporter) => {
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

    app.get("/useraccount", jwt.validateJWT, async (req, res) => {
        res.json(await svc.dao.getById(req.user.id))
    })

    app.get("/useraccount/:id", jwt.validateJWT, async (req, res) => {
        try {
            const user = await svc.dao.getById(req.params.id)
            if (user === undefined) {
                return res.status(404).end()
            }

            if (user.id !== req.user.id) {
                return res.status(403).end()
            }

            return res.json(user)
        } catch (e) { res.status(400).end() }
    })

    app.put("/useraccount", jwt.validateJWT, async (req, res) => {
        const user = req.body
        //|| (!user.isValid(user))
        if ((user.id === undefined) || (user.id == null) ) {
            return res.status(400).end()
        }
        const prevUser = await svc.dao.getById(user.id)

        if (prevUser  === undefined) {
            return res.status(404).end()
        }
        if (prevUser.id !== req.user.id) {
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
        //|| (!user.isValid(user))
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
                        .then(res.status(200).end())
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

}