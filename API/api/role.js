module.exports = (app, serviceRole, jwt) => {
    app.get("/role", jwt.validateJWT, async (req, res) => {
        res.json(await serviceRole.dao.getAll(req.user))
    })
}