class IndexController extends BaseController {
    constructor() {
        super()
        this.tableAllLists = $('#tableAllLists')
        this.tableBodyAllLists = $('#tableBodyAllLists')
        this.tableListsShare = $('#tableListsShare')
        this.tableBodyListsShare = $('#tableBodyListsShare')
        this.displayAllLists()
        this.displayListsShare()
    }

    async displayListsShare() {
        let content = ''
        try {

            for (const list of await this.model.getListsShareByUser()) {
                const date = list.date.toLocaleDateString()
                const userShare = Object.assign(new User(), await this.model.getUserShare(list.id))

                if(list.state === 1){
                    content += `<tr><td>
                    <a  onclick="navigateParams('listcurent',${list.id}, true)">${list.shop}</a>
                    </td>
                    <td>${date}</td>
                    <td>${userShare.displayname}</td>
                    <td class="icon"> <button class="btn" onclick="indexController.edit(${list.id})"><i class="material-icons">edit</i></button>
                    <button class="btn" onclick="indexController.displayConfirmDeleteShare(${list.id}, ${list.useraccount_id}, ${list.state})"><i class="material-icons">delete</i></button></td>

                    </td></tr>`
                } else {
                    content += `<tr><td>
                    <a  onclick="navigateParams('listcurent',${list.id}, true)">${list.shop}</a>
                    </td>
                    <td>${date}</td>
                    <td>${userShare.displayname}</td>
                    <td><button class="btn" onclick="indexController.displayConfirmDeleteShare(${list.id}, ${list.useraccount_id}, ${list.state})"><i class="material-icons">delete</i></button></td>
                    </tr>`
                }

            }

            this.tableBodyListsShare.innerHTML = content
        } catch (err) {
            console.log(err)
            if(err == 401){
                logout()
            }
            this.displayServiceError()
        }
    }

    async displayAllLists() {
        let content = ''
        try {
            for (const list of await this.model.getAllLists()) {
                const date = list.date.toLocaleDateString()
                content += `<tr>
                    <td>
                    <a  onclick="navigateParams('listcurent',${list.id})">${list.shop}</a>
                    </td>
                    <td>${date}</td>`

                content +=`<td>`
                for (let user of await this.model.getUsersList(list.id)) {
                    content +=
                        `- ${user.displayname}
                    <a onclick="indexController.displayConfirmDeleteShare(${list.id}, ${user.id}, ${user.state})">annuler</i></a>
                    
                    <br>`
                }
                content +=`</td>`

                content +=
                    `
                    <td class="icon">
                    <button class="btn" onclick="indexController.edit(${list.id})"><i class="material-icons">edit</i></button>
                    <button class="btn" onclick="indexController.archive(${list.id})"><i class="material-icons">archive</i></button>
                    <button class="btn" onclick="indexController.share(${list.id})"><i class="material-icons">share</i></button>
                    <button class="btn" onclick="indexController.displayConfirmDelete(${list.id})"><i class="material-icons">delete</i></button>
                    </td></tr>`
            }

            this.tableBodyAllLists.innerHTML = content
        } catch (err) {
            console.log(err)
            if(err == 401){
                logout()
            }
            this.displayServiceError()
        }
    }

    async share(id) {
        try {
            const object = await this.model.getList(id)
            if (object === undefined) {
                this.displayServiceError()
                return
            }
            if (object === null) {
                this.displayNotFoundError()
                return
            }
            this.selectedList = object
            navigate('listshare')
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }

    }

    async edit(id) {
        try {
            const object = await this.model.getList(id)
            if (object === undefined) {
                this.displayServiceError()
                return
            }
            if (object === null) {
                this.displayNotFoundError()
                return
            }
            this.selectedList = object
            navigate('listedit')
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async archive(id) {
        try {
            const object = await this.model.getList(id)
            if (object === undefined) {
                this.displayServiceError()
                return
            }
            if (object === null) {
                this.displayNotFoundError()
                return
            }
            object.archived = true
            this.model.update(object)
            navigate('index')
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    undoDelete() {
        if (this.deletedList) {

            this.model.insert(this.deletedList).then(status => {
                if (status == 200) {
                    this.deletedList = null
                    this.displayUndoDone()
                    this.displayAllLists()
                }
            }).catch(_ => this.displayServiceError())

            if (this.deletedItems) {
                for (const item of this.deletedItems) {
                    item.idList = this.deletedList.id + 1
                    this.modelItem.insert(item).then(status => {
                        if (status == 200) {
                            this.displayUndoDone()
                        }
                    }).catch(_ => this.displayServiceError())

                }
                this.deletedItems = null
            }

        }
    }

    undoDeleteShare() {
        if (this.deletedListId && this.deletedUserId ) {

            this.modelShare.insert(this.deletedListId, this.deletedUserId, this.deleteState).then(status => {
                if (status == 200) {
                    this.deletedListId = null
                    this.deletedUserId = null
                    this.deleteState = null
                    this.displayUndoDone()
                    this.displayListsShare()
                    this.displayAllLists()

                }
            }).catch(_ => this.displayServiceError())
        }
    }

    async displayConfirmDelete(id) {
        this.deletedItems = []
        try {
            const list = await this.model.getList(id)
            super.displayConfirmDelete(list, async () => {
                if(await this.modelItem.getListItems(id)){
                    for (const item of await this.modelItem.getListItems(id)) {
                        this.deletedItems.push(item)
                        await this.modelItem.delete(item.id)
                    }
                }
                await this.modelShare.deleteShareList(id)
                switch (await this.model.delete(id)) {
                    case 200:
                        this.deletedList = list
                        this.displayDeletedMessage("indexController.undoDelete()");
                        break
                    case 404:
                        this.displayNotFoundError();
                        break
                    default:
                        this.displayServiceError()
                }
                this.displayAllLists()
                this.displayListsShare()
            })
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async displayConfirmDeleteShare(listId, userId, state) {
        this.deletedItems = []
        try {
            switch (await this.modelShare.delete(listId, userId)) {
                case 200:
                    this.deletedListId = listId
                    this.deletedUserId = userId
                    this.deleteState= state
                    this.displayDeletedMessage("indexController.undoDeleteShare()");
                    break
                case 404:
                    this.displayNotFoundError();
                    break
                default:
                    this.displayServiceError()
            }
            this.displayListsShare()
            this.displayAllLists()

        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

}

window.indexController = new IndexController()
