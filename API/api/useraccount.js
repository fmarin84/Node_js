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
        res.json(await svc.dao.getUserByLogin(req.params.login))
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






    /*
    app.get('/useraccount',async function (req, res) {

            // async..await is not allowed in global scope, must use a wrapper
            //async function main() {
                // Generate test SMTP service account from ethereal.email
                // Only needed if you don't have a real mail account for testing
                let testAccount = await nodemailer.createTestAccount();

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: "gmail",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    tls:{
                        rejectUnauthorized:false
                    },
                    auth: {
                        user: testAccount.user, // generated ethereal user
                        pass: testAccount.pass, // generated ethereal password
                    },
                });

                // send mail with defined transport object
                let info = await transporter.sendMail({
                    from: '"Fred Foo 👻" <foo@example.com>', // sender address
                    to: "fabien.marin84@gmail.com", // list of receivers
                    subject: "Hello ✔", // Subject line
                    text: "Hello world?", // plain text body
                    html: "<b>valider votre inscription :</b>", // html body
                });

                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
           // }

            //main().catch(console.error);

        });

     */


/*
   app.get('/useraccount', function (req, res) {

       let transport = nodemailer.createTransport({
           host: 'smtp.mailtrap.io',
           port: 2525,
           auth: {
               user: 'put_your_username_here',
               pass: 'put_your_password_here'
           }
       });

       const message = {
           from: 'elonmusk@tesla.com', // Sender address
           to: 'fabien.marin84@gmail.com',         // List of recipients
           subject: 'Design Your Model S | Tesla', // Subject line
           text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
       };
       transport.sendMail(message, function(err, info) {
           if (err) {
               console.log(err)
           } else {
               console.log(info);
           }
       });

   });

 */


/*
   app.get('/useraccount/mail/', function (req, res, next) {
       mailer.send('email', {
           to: 'fabien.marin84@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.
           subject: 'Test Email', // REQUIRED.
           otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
       }, function (err) {
           if (err) {
               // handle error
               console.log(err);
               res.send('There was an error sending the email');
               return;
           }
           res.send('Email Sent');
       });
   });

 */


}