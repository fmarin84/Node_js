class IndexController extends BaseController {
    constructor() {
        super()
        this.svc = new UserAccountAPI()
        this.reauthenticate()
        this.displayAdmin()
        this.tableBodyAllLists = $('#tableBodyAllLists')
        this.tableBodyListsShare = $('#tableBodyListsShare')
        this.navigAdmin = $('#navigAdmin')
        this.displayAllLists()
        this.displayListsShare()
        this.displayBtSubscrib()
        this.displayNotif()
    }

    async displayNotif() {
        const currentUser = await this.modelUser.getThisUser()
        const nbNotifs = await this.modelNotification.countNotification(currentUser.id)
        if(nbNotifs > 0){
            $('#notifiaction').innerText = nbNotifs
            $('#notificationMenu').innerText = nbNotifs
        }
    }

    async reauthenticate(email = null, challenge = null) {
        const currentUser = Object.assign(new User(),await this.modelUser.getThisUser())

        let login = currentUser.login
        let password = currentUser.challenge
        if(email !== null){
            login = email
            password = challenge
        }

        if ((login != null) && (password != null)) {

            this.svc.reauthenticate(login, password)
                .then(res => {
                    localStorage.setItem("token", res.token)
                    //window.location.replace("index.html")
                })
                .catch(err => {
                    console.log(err)
                    if (err === 401) {
                    } if (err === 400) {
                    } else {
                        this.displayServiceError()
                    }
                    logout()
                })
        }
    }

    async navigateRole(navigation){
        const currentUser = await this.modelUser.getThisUser()
        const isAbonne = await this.modelUser.getThisUserIsAbonne(currentUser.id)
        const isAdmin = await this.modelUser.getThisUserIsAdmin(currentUser.id)
        const lists = await this.model.getListsByUser()

        if(lists.length >= 1){
            if(isAbonne || isAdmin){
                navigate(navigation)
            } else {
                // affiche modal user pas abonne
                confirm('Vous n\'avez pas accès à cette fonctionnalité car vous n\'êtes pas abonné')
            }
        } else if(lists.length === 0){
            navigate(navigation)
        }
    }

    async displayBtSubscrib() {
        const currentUser = await this.modelUser.getThisUser()
        const isAbonne = await this.modelUser.getThisUserIsAbonne(currentUser.id)
        if(!isAbonne){
            if (typeof $('#btSubscrib') !== 'undefined') {
                $('#btSubscrib').classList.remove("hidden")
            }
        }
    }

    async displayAdmin() {
        const currentUser = await this.modelUser.getThisUser()

        const isAdmin = await this.modelUser.getThisUserIsAdmin(currentUser.id)

        if(isAdmin){
            this.navigAdmin.innerHTML = "<a onClick=\"navigate('admin')\" style='font-weight: 700;'>Administration</a>"
        }
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

                let date1 = new Date();
                let date2 = new Date();

                date1 = list.date.getTime() / 86400000;
                date2 = date2.getTime() / 86400000;
                date2 = date2 + 7;
                let diff = new Number(date2 - date1).toFixed(0)

                const notification = await this.modelNotification.getNotificationByListShareId(list.id)

                if (diff > 7) {
                    if ((notification.length === 0) || (notification.islue === false)){
                        await this.modelNotification.insert(new Notif("« liste périmée »", `Votre liste ${list.toString()} est peut-être périmée, vous pouvez archiver ou supprimer votre liste` , false, list.useraccount_id, list.id))
                    }
                }
            }

            this.tableBodyListsShare.innerHTML = content
        } catch (err) {
            console.log(err)
            if(err === 401){
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
            if(err === 401){
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
            this.navigateRole('listshare')
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
