module.exports = (app, serviceNotification, jwt) => {
    // app.get("/notification/", jwt.validateJWT, async (req, res) => {
    //     res.json(await serviceNotification.dao.getAll())
    // })

    app.get("/notification/:id", jwt.validateJWT, async (req, res) => {
        try {
            const notification = await serviceNotification.dao.getById(req.params.id)
            return res.json(notification)
        } catch (e) { res.status(400).end() }
    })


    app.get("/notification/user/:userId", jwt.validateJWT, async (req, res) => {
        try {
            const notifications = await serviceNotification.dao.getNotificationByUser(req.params.userId)
            return res.json(notifications)
        } catch (e) { res.status(400).end() }
    })

    // app.post("/notification", jwt.validateJWT, (req, res) => {
    //     const notification = req.body
    //     // if (!serviceNotification.isValid(item))  {
    //     //     return res.status(400).end()
    //     // }
    //     serviceNotification.dao.insert(notification)
    //         .then(res.status(200).end())
    //         .catch(e => {
    //             console.log(e)
    //             res.status(500).end()
    //         })
    // })
    //
    app.put("/notification", jwt.validateJWT, async (req, res) => {
        const notification = req.body
        //|| (!serviceNotification.isValid(item))
        if ((notification.id === undefined) || (notification.id == null) ) {
            return res.status(400).end()
        }
        if (await serviceNotification.dao.getById(notification.id) === undefined) {
            return res.status(404).end()
        }
        serviceNotification.dao.update(notification)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
}
