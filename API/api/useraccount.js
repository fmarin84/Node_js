module.exports = (app, svc, jwt, transporter) => {
    app.post('/useraccount/authenticate', (req, res) => {
        const { login, password } = req.body
        if ((login === undefined) || (password === undefined)) {
            res.status(400).end()
            return
        }
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

    app.post('/useraccount/register', async (req, res) => {
        const {name, login, password } = req.body
        if ((login === undefined) || (password === undefined)|| (name === undefined)) {
            res.status(400).end()
            return
        }

        let isinsert = false

        await svc.validateLogin(login)
            .then(isRegister => {
                if (isRegister) {
                    res.status(401).end()
                    return
                }

                if (!isRegister) {
                    svc.insert(name, login, password)
                        .then(register => {
                            if (!register) {
                                res.status(401).end()
                                return
                            }
                        })
                        .catch(e => {
                            console.log(e)
                            res.status(500).end()
                        })

                    isinsert = true
                }

            })
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })

        if(isinsert){
            const user = await svc.dao.getByLogin(login)
                .then()
                .catch(e => {
                    console.log(e)
                    res.status(500).end()
                })

            if(user !== undefined){
                const date = new Date()
                let dateTime = date.getTime()
                const date24 = new Date()
                date24.setDate(date.getDate()+1)
                let dateTime24 = date24.getTime()

                const link = `http://localhost:3333/useraccount/authentication/${dateTime24}/${user.id}`
                let mailOptions = {
                    from: 'fabien.esimed@gmail.com',
                    to: login,
                    subject: 'Validation de compte',
                    text:'Cliquez sur ce lien pour valider votre compte : ' + link
                };

                transporter.sendMail(mailOptions, function(err, data) {
                    if(err){
                        console.log('Error Occurs')
                    } else {
                        console.log('Email sent !!')
                    }
                });
            }
        }
    })

    app.post('/useraccount/sendLink', async (req, res) => {
        const login = req.body.login

        const user = await svc.dao.getByLogin(login)
            .then()
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })

        if(user !== undefined){
            const date = new Date()
            let dateTime = date.getTime()
            const date24 = new Date()
            date24.setDate(date.getDate()+1)
            let dateTime24 = date24.getTime()

            const link = `http://localhost:3333/useraccount/authentication/${dateTime24}/${user.id}`
            let mailOptions = {
                from: 'fabien.esimed@gmail.com',
                to: login,
                subject: 'Validation de compte',
                text:'Cliquez sur ce lien pour valider votre compte : ' + link
            };

            transporter.sendMail(mailOptions, function(err, data) {
                if(err){
                    console.log('Error Occurs')
                } else {
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
            const date = new Date()
            let dateTime = date.getTime()
            const date30m = new Date()
            date30m.setDate(date.getMinutes()+30)
            let dateTime30m = date30m.getTime()

            const link = `http://localhost:63342/Node_js/front/forgetpassword.html?d=${dateTime30m}`
            let mailOptions = {
                from: 'fabien.esimed@gmail.com',
                to: login,
                subject: 'Validation de compte',
                text:'Cliquez sur ce lien pour réinitialisation votre mot de passe : ' + link
            };


            transporter.sendMail(mailOptions, function(err, data) {
                if(err){
                    console.log('Error Occurs')
                } else {
                    console.log(login)
                    console.log(link)
                    console.log('Email sent !!')
                }
            });
        }

    })

    app.get('/useraccount/authentication/:date/:idUser', (req, res) => {

        if ((req.params.date === "") || (req.params.idUser === "")) {
            res.status(400).end()
            return
        }

        const date = new Date()
        const dateTime = date.getTime()

        if(req.params.date < dateTime){
            res.status(401).end()
            return
        }

         svc.dao.setIsActived(req.params.idUser)
             .then(actived => {
                 if (!actived) {
                     res.status(401).end()
                     return
                 }
             })
             .catch(e => {
                 console.log(e)
                 res.status(500).end()
             })

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

    app.put("/useraccount/forget", async (req, res) => {
        const user = req.body

        //|| (!user.isValid(user))
        if ((user.login === undefined) || (user.login == null) ) {
            return res.status(400).end()
        }
        const prevUser = await svc.dao.getByLogin(user.login)

        if (prevUser  === undefined) {
            return res.status(404).end()
        }
        if (prevUser.login !== user.login) {
            return res.status(403).end()
        } else {
            user.id = prevUser.id

            await svc.validateLogin(user.login)
                .then(isRegister => {
                    if (isRegister) {
                        svc.updatePwd(user)
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

}