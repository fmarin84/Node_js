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
                    text:'Cliquer sur ce lien pour valider votre compte : ' + link
                };

                transporter.sendMail(mailOptions, function(err, data) {
                    if(err){
                        console.log('Error Occurs')
                    } else {
                        console.log('Emmail sent !!')
                    }
                });
            }
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

    app.get("/useraccount/", jwt.validateJWT, async (req, res) => {
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

}