const Share = require('../datamodel/share')


module.exports = (app, svc, jwt) => {
    /*
    app.get("/share", jwt.validateJWT, async (req, res) => {
        res.json(await serviceShare.dao.getByUser(req.user))
    })
*/

    app.post("/share/:listId/:userId/:state", jwt.validateJWT, (req, res) => {

        const list_id = parseInt(req.params.listId, 10)
        const useraccount_id = parseInt(req.params.userId, 10)
        const state = parseInt(req.params.state, 10)

        const share = new Share(list_id, useraccount_id, state)

        if (!svc.isValid(share))  {
            return res.status(400).end()
        }

        svc.dao.insert(share)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.delete("/share/delete/:listId/:userId", jwt.validateJWT, async (req, res) => {
        svc.dao.delete(req.params.listId, req.params.userId)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.delete("/share/delete/:listId", jwt.validateJWT, async (req, res) => {
        svc.dao.deleteShareList(req.params.listId)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })


}