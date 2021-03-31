module.exports = (app, serviceList, jwt) => {
    app.get("/list", jwt.validateJWT, async (req, res) => {
        res.json(await serviceList.dao.getAll(req.user))
    })

    app.get("/list/archive", jwt.validateJWT, async (req, res) => {
        res.json(await serviceList.dao.getAchived(req.user))
    })

    app.get("/list/:id", jwt.validateJWT, async (req, res) => {
        try {
            const list = await serviceList.dao.getById(req.params.id)
            if (list === undefined) {
                return res.status(404).end()
            }
            if (list.useraccount_id !== req.user.id) {
                return res.status(403).end()
            }
            return res.json(list)
        } catch (e) { res.status(400).end() }
    })

    app.post("/list", jwt.validateJWT, (req, res) => {
        const list = req.body
        if (!serviceList.isValid(list))  {
            return res.status(400).end()
        }
        list.useraccount_id = req.user.id
        serviceList.dao.insert(list)
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
            return res.status(403).end()
        }
        serviceList.dao.update(list)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
}
