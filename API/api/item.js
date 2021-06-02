module.exports = (app, serviceItem, jwt) => {
    app.get("/item", jwt.validateJWT, async (req, res) => {
        res.json(await serviceItem.dao.getAll(req.user))
    })

    app.get("/item/list/:listId", jwt.validateJWT, async (req, res) => {
        try {
            const items = await serviceItem.dao.getAllToList(req.params.listId,req.user )
            if (items === undefined) {
                return res.status(404).end()
            }
            return res.json(items)
        } catch (e) { res.status(400).end() }
    })

    app.get("/item/share/:listId", jwt.validateJWT, async (req, res) => {
        try {
            const items = await serviceItem.dao.getShare(req.params.listId,req.user )
            if (items === undefined) {
                return res.status(404).end()
            }
            return res.json(items)
        } catch (e) { res.status(400).end() }
    })

    app.get("/item/:id", jwt.validateJWT, async (req, res) => {
        try {
            const item = await serviceItem.dao.getById(req.params.id)
            if (item === undefined) {
                return res.status(404).end()
            }
            return res.json(item)
        } catch (e) { res.status(400).end() }
    })

    app.post("/item", jwt.validateJWT, (req, res) => {
        const item = req.body
        if (!serviceItem.isValid(item))  {
            return res.status(400).end()
        }
        serviceItem.dao.insert(item)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
    app.delete("/item/:id", jwt.validateJWT, async (req, res) => {
        const item = await serviceItem.dao.getById(req.params.id)
        if (item === undefined) {
            return res.status(404).end()
        }
        serviceItem.dao.delete(req.params.id)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
    app.put("/item", jwt.validateJWT, async (req, res) => {
        const item = req.body
        if ((item.id === undefined) || (item.id === null) || (serviceItem.isValid(item) === false)) {
            return res.status(400).end()
        }
        if (await serviceItem.dao.getById(item.id) === undefined) {
            return res.status(404).end()
        }
        serviceItem.dao.update(item)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
}
