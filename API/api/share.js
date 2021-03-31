module.exports = (app, svc, jwt) => {
    app.get("/share", jwt.validateJWT, async (req, res) => {
        res.json(await serviceShare.dao.getByUser(req.user))
    })

    app.post('/share/list', (req, res) => {

    })
}