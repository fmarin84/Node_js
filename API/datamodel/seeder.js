const List = require('./list')
const Item = require('./item')

module.exports = (userAccountService, listService, itemService) => {
    return new Promise(async (resolve, reject) => {
        try {
            await userAccountService.dao.db.query("CREATE TABLE useraccount(id SERIAL PRIMARY KEY, displayname TEXT NOT NULL, login TEXT NOT NULL, challenge TEXT NOT NULL)")
            await listService.dao.db.query("CREATE TABLE list(id SERIAL PRIMARY KEY, shop TEXT NOT NULL, date DATE, archived BOOLEAN, useraccount_id INTEGER REFERENCES useraccount(id))")
            await itemService.dao.db.query("CREATE TABLE item(id SERIAL PRIMARY KEY, label TEXT NOT NULL, quantity INTEGER NOT NULL, checked BOOLEAN, fk_id_list INTEGER, FOREIGN KEY (fk_id_list) REFERENCES list(id))")
            // INSERTs
        } catch (e) {
            if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                resolve()
            } else {
                reject(e)
            }
            return
        }

        userAccountService.insert("User1", "user1@example.com", "azerty")
            .then(_ => userAccountService.dao.getByLogin("user1@example.com"))
            .then(async user1 => {
                await listService.dao.insert(new List("Carrefour", new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)), false, user1.id))
                await itemService.dao.insert(new Item("Tomate" , 2, false, 1))

            })
        userAccountService.insert("User2", "user2@example.com", "azerty")
            .then(_ => userAccountService.dao.getByLogin("user2@example.com"))
            .then(async user2 => {
                //for (let i = 0; i < 5; i++) {
                    await listService.dao.insert(new List("Monoprix", new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)), false, user2.id))
                    await itemService.dao.insert(new Item("Pates" , 1, false, 2))

                //}
                resolve()
            })
    })

}