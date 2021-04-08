class Model {
    constructor() {
        this.api = new ListAPI()
    }

    async getAchived(){
        let lists = []
        for (let list of await this.api.getAchived()) {
            list.date = new Date(list.date)
            lists.push(Object.assign(new List(), list))

        }
        return lists
    }

    async getUserShare(listId) {

        const user = await this.api.getUserShare(listId)
        return Object.assign(new User(), user[0])
    }

    async getUsersList(listId) {
        let users = []
        for (let user of await this.api.getUsersList(listId)) {
            users.push(Object.assign(new User(), user))
        }
        return users
    }


    async getAllLists() {
        let lists = []
        for (let list of await this.api.getAll()) {
            list.date = new Date(list.date)
            lists.push(Object.assign(new List(), list))

        }
        return lists
    }

    async getListsShareByUser() {
        let lists = []

        for (let list of await this.api.getListsShareByUser()) {
            list.date = new Date(list.date)
            lists.push(Object.assign(new List(), list))

        }
        return lists
    }

    async getList(id) {
        try {
            const list = Object.assign(new List(), await this.api.get(id))
            list.date = new Date(list.date)
            return list
        } catch (e) {
            if (e === 404) return null
            return undefined
        }
    }
    delete(id) {
        return this.api.delete(id).then(res => res.status)
    }
    insert(list) {
        return this.api.insert(list).then(res => res.status)
    }
    update(list) {
        return this.api.update(list).then(res => res.status)
    }
}

class ModelItem {
    constructor() {
        this.api = new ItemAPI()
    }

    async getListItemsShare(idList) {
        let Items = []
        for (let item of await this.api.getShare(idList)) {
            if(item.fk_id_list === idList){
                Items.push(Object.assign(new Item(), item))
            }
        }
        return Items
    }

    async getListItems(idList) {
        let Items = []
        for (let item of await this.api.getAll(idList)) {
             if(item.fk_id_list === idList){
                Items.push(Object.assign(new Item(), item))
             }

        }
        return Items
    }
    async getItem(id) {
        try {
            const item = Object.assign(new Item(), await this.api.get(id))
            item.date = new Date(item.date)
            return item
        } catch (e) {
            if (e === 404) return null
            return undefined
        }
    }
    delete(id) {
        return this.api.delete(id).then(res => res.status)
    }
    insert(item) {
        return this.api.insert(item).then(res => res.status)
    }
    update(item) {
        return this.api.update(item).then(res => res.status)
    }

}

class ModelUser {
    constructor() {
        this.api = new UserAccountAPI()
    }

    async getThisUser() {
        try {
            const user = Object.assign(new User(), await this.api.getThisUser())
            return user
        } catch (e) {
            if (e === 404) return null
            return undefined
        }
    }

    async getUser(id) {
        try {
            const user = Object.assign(new User(), await this.api.get(id))
            return user
        } catch (e) {
            if (e === 404) return null
            return undefined
        }
    }

    async getByLogin(login) {

        let users = []

        for (let user of await this.api.getByLogin(login)) {
            users.push(Object.assign(new User(), user))
        }
        return users
    }

    delete(id) {
        return this.api.delete(id).then(res => res.status)
    }
    insert(user) {
        return this.api.insert(user).then(res => res.status)
    }
    update(user) {
        return this.api.update(user).then(res => res.status)
    }
    updatePwd(user) {
        return this.api.updatePwd(user).then(res => res.status)
    }
}


class ModelShare {
    constructor() {
        this.api = new ShareAPI()
    }

    deleteShareList(listId) {
        return this.api.deleteShareList(listId).then(res => res.status)
    }
    delete(listId, userId) {
        return this.api.delete(listId, userId).then(res => res.status)
    }
    insert(listId, userId,state) {
        return this.api.insert(listId, userId,state).then(res => res.status)
    }
    update(listId, userId,state) {
        return this.api.update(listId, userId,state).then(res => res.status)
    }
}