module.exports = (app, serviceList, jwt) => {
    app.get("/list", jwt.validateJWT, async (req, res) => {
        res.json(await serviceList.dao.getAll(req.user))
    })

    app.get("/list/archive", jwt.validateJWT, async (req, res) => {
        res.json(await serviceList.dao.getAchived(req.user))
    })

    app.get("/list/share/:listId", jwt.validateJWT, async (req, res) => {
        res.json(await serviceList.dao.getListsShareByList(req.params.listId))
    })

    app.get("/list/share", jwt.validateJWT, async (req, res) => {
        res.json(await serviceList.dao.getListsShareByUser(req.user))
    })

    app.get("/list/user", jwt.validateJWT, async (req, res) => {
        res.json(await serviceList.dao.getListsByUser(req.user))
    })

    app.get("/list/share/user/:listId", jwt.validateJWT, async (req, res) => {
        try {
            const user = await serviceList.dao.getUserShare(req.params.listId)
            if (user === undefined) {
                return res.status(404).end()
            }
            return res.json(user)
        } catch (e) { res.status(400).end() }
    })

    app.get("/list/share/users/:listId", jwt.validateJWT, async (req, res) => {
        try {
            const list = await serviceList.dao.getUsersList(req.params.listId)
            if (list === undefined) {
                return res.status(404).end()
            }
            return res.json(list)
        } catch (e) { res.status(400).end() }
    })

    app.get("/list/:id", jwt.validateJWT, async (req, res) => {
        try {
            const list = await serviceList.dao.getById(req.params.id)
            if (list === undefined) {
                return res.status(404).end()
            }

            return res.json(list)
        } catch (e) { res.status(400).end() }
    })

    app.post("/list", jwt.validateJWT, async (req, res) => {
        let list = req.body
        if(req.body.list !== undefined){
            list = req.body.list
        }

        if (!serviceList.isValid(list))  {
            return res.status(400).end()
        }
        list.useraccount_id = req.user.id
        const lidtId = await serviceList.dao.insert(list)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })

    })

    app.delete("/list/:id", jwt.validateJWT, async (req, res) => {
        const list = await serviceList.dao.getById(req.params.id)
        if (list === undefined) {
            return res.status(404).end()
        }
        if (list.useraccount_id !== req.user.id) {
            return res.status(403).end()
        }
        serviceList.dao.delete(req.params.id)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.put("/list", jwt.validateJWT, async (req, res) => {
        const list = req.body
        if ((list.id === undefined) || (list.id == null) || (!serviceList.isValid(list))) {
            return res.status(400).end()
        }
        const prevList = await serviceList.dao.getById(list.id)

        if (prevList  === undefined) {
            return res.status(404).end()
        }

        if (prevList.useraccount_id !== req.user.id) {
            if (await serviceList.dao.getListsShareByList(req.params.listId) === []) {
                return res.status(403).end()
            }
        }
        serviceList.dao.update(list)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
}
