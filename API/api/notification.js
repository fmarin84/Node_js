module.exports = (app, serviceNotification, jwt) => {

    app.get("/notification/:id", jwt.validateJWT, async (req, res) => {
        try {
            const notification = await serviceNotification.dao.getById(req.params.id)
            return res.json(notification)
        } catch (e) { res.status(400).end() }
    })

    app.get("/notification/list/:id", jwt.validateJWT, async (req, res) => {
        try {
            const notification = await serviceNotification.dao.getNotificationByListShareId(req.params.id)
            return res.json(notification)
        } catch (e) { res.status(400).end() }
    })

    app.get("/notification/user/all/:userId", jwt.validateJWT, async (req, res) => {
        try {
            const notifications = await serviceNotification.dao.getAllNotifications(req.params.userId)
            return res.json(notifications)
        } catch (e) { res.status(400).end() }
    })

    app.get("/notification/user/:userId", jwt.validateJWT, async (req, res) => {
        try {
            const notifications = await serviceNotification.dao.getNotificationByUser(req.params.userId)
            return res.json(notifications)
        } catch (e) { res.status(400).end() }
    })

    app.get("/notification/count/:userId", jwt.validateJWT, async (req, res) => {
        try {
            const nb = await serviceNotification.dao.countNotifications(req.params.userId)
            return res.json(nb)
        } catch (e) { res.status(400).end() }
    })

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

    app.post("/notification", jwt.validateJWT, async (req, res) => {
        const notification = req.body
        // if (!serviceNotification.isValid(notification))  {
        //     return res.status(400).end()
        // }
        notification.useraccount_id = req.user.id
        serviceNotification.dao.insert(notification)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })

    })
}
