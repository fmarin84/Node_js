const List = require('./list')
const Item = require('./item')
const Share = require('./share')

module.exports = (userAccountService, listService, itemService, shareService) => {
    return new Promise(async (resolve, reject) => {
        try {
            await userAccountService.dao.db.query("CREATE TABLE useraccount(id SERIAL PRIMARY KEY, displayname TEXT NOT NULL, login TEXT NOT NULL, challenge TEXT NOT NULL, isactived BOOLEAN DEFAULT false)")
            await listService.dao.db.query("CREATE TABLE list(id SERIAL PRIMARY KEY, shop TEXT NOT NULL, date DATE, archived BOOLEAN, useraccount_id INTEGER REFERENCES useraccount(id))")
            await itemService.dao.db.query("CREATE TABLE item(id SERIAL PRIMARY KEY, label TEXT NOT NULL, quantity INTEGER NOT NULL, checked BOOLEAN, fk_id_list INTEGER, FOREIGN KEY (fk_id_list) REFERENCES list(id))")
            await shareService.dao.db.query("CREATE TABLE share(fk_id_list INTEGER, useraccount_id INTEGER, state INTEGER, PRIMARY KEY (fk_id_list, useraccount_id, state), FOREIGN KEY (fk_id_list) REFERENCES list(id), FOREIGN KEY (useraccount_id) REFERENCES useraccount(id))")
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
                await itemService.dao.insert(new Item("Pâtes" , 3, true, 1))
                await itemService.dao.insert(new Item("Pizza" , 2, true, 1))
                await itemService.dao.insert(new Item("Tomate" , 1, false, 1))
                await listService.dao.insert(new List("Lidl", new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)), false, user1.id))
                await itemService.dao.insert(new Item("Poulet" , 1, false, 2))
                await itemService.dao.insert(new Item("Frites" , 2, false, 2))
                await itemService.dao.insert(new Item("Légumes" , 4, true, 2))
                await listService.dao.insert(new List("Carrefour", new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)), true, user1.id))
                await itemService.dao.insert(new Item("Steak" , 4, true, 3))
                await itemService.dao.insert(new Item("Sachet de frites" , 2, true, 3))

            })

        userAccountService.insert("User2", "user2@example.com", "azerty")
            .then(_ => userAccountService.dao.getByLogin("user2@example.com"))
            .then(async user2 => {
                    await listService.dao.insert(new List("Auchan", new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)), false, user2.id))
                    await itemService.dao.insert(new Item("Fromage" , 1, false, 4))
                    await itemService.dao.insert(new Item("Pâtes" , 2, true, 4))
                    await itemService.dao.insert(new Item("Viande" , 1, false, 4))
                    await listService.dao.insert(new List("Auchan", new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)), true, user2.id))
                    await itemService.dao.insert(new Item("Pack d'eau" , 4, true, 5))
                    await itemService.dao.insert(new Item("Sirop de menthe" , 2, true, 5))
                    await listService.dao.insert(new List("Auchan", new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)), false, user2.id))
                    await itemService.dao.insert(new Item("Pizza" , 1, false, 6))
                    await itemService.dao.insert(new Item("Chips" , 2, true, 6))
                    await itemService.dao.insert(new Item("Soda" , 3, false, 6))
                    await shareService.dao.insert(new Share(4,1,1))
                    await shareService.dao.insert(new Share(6,1,0))
                    await shareService.dao.insert(new Share(2,2,0))
                resolve()
            })
    })

}