module.exports = (app, servicePayment, jwt) => {


    app.get("/payment/:userId", jwt.validateJWT, async (req, res) => {
        try {
            const payment = await servicePayment.dao.getByUserId(req.params.userId)
            if (payment === undefined) {
                return res.json([])
            }
            return res.json(payment)
        } catch (e) { res.status(400).end() }
    })

    app.post("/payment", jwt.validateJWT, async (req, res) => {
        const payment = req.body
        if (!servicePayment.isValid(payment))  {
            return res.status(400).end()
        }
        payment.useraccount_id = req.user.id
        servicePayment.dao.insert(payment)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })

    })
}
