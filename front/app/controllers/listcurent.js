class ListCurentController extends BaseController {
    constructor() {
        super()
        this.fk_id_list = window.idEntity
        this.isShare = window.isShare
        this.displayList()
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
    async displayListsShare() {
        let content = ''
        try {
            for (const list of await this.model.getListsShareByUser()) {
                const date = list.date.toLocaleDateString()
                const userShare = Object.assign(new User(), await this.modelUser.getUser(list.useraccount_id))

                content += `<tr><td>
                    <a  onclick="navigateParams('listcurent',${list.id})">${list.shop}</a>
                    </td>
                    <td>${date}</td>
                    <td>${userShare.displayname}</td>
                    <td class="icon">
                    <button class="btn" onclick="indexController.edit(${list.id})"><i class="material-icons">edit</i></button>
                    </td></tr>`
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



    async displayList() {
        let content = ''
        try {

            let items = null

            const list = await this.model.getList(this.fk_id_list)

            if(this.isShare){
                items = await this.modelItem.getListItemsShare(list.id)
            }
            else {
                items = await this.modelItem.getListItems(list.id)
                if(!list.archived){
                    $('#addItem').style.display = "block";
                }
            }

            for(let item of items) {

                if(list.archived){

                    if(item.checked === false){
                        content += `<tr><td><p><label><input type="checkbox"  disabled/><span></span></label></p></td>`
                    } else {
                        content += `<tr><td><p><label><input type="checkbox" checked="checked"  disabled/><span></span></label></p></td>`
                    }

                    content += `
                    <td>${item.quantity}</td>
                    <td>${item.label}</td>`
                } else if((this.isShare) && (item.state === 1)){
                    $('#addItem').style.display = "block";

                    if(item.checked === false){
                        content += `<tr><td><p><label><input type="checkbox"  onclick='listcurentController.Check(${item.id})'/><span></span></label></p></td>`
                    } else {
                        content += `<tr><td><p><label><input type="checkbox" checked="checked"  onclick='listcurentController.Check(${item.id})'/><span></span></label></p></td>`
                    }

                    content += `
                    <td>${item.quantity}</td>
                    <td>${item.label}</td>
                    <td><button class="btn" onclick="listcurentController.edititem(${item.id})"><i class="material-icons">edit</i></button></td>
                    <td><button class="btn" onclick='listcurentController.displayConfirmDelete(${item.id})'><i class="material-icons">delete</i></button></td>`
                } else if((this.isShare) && (item.state === 0)){

                    if(item.checked === false){
                        content += `<tr><td><p><label><input type="checkbox"  disabled/><span></span></label></p></td>`
                    } else {
                        content += `<tr><td><p><label><input type="checkbox" checked="checked"  disabled/><span></span></label></p></td>`
                    }

                    content += `
                    <td>${item.quantity}</td>
                    <td>${item.label}</td>`
                } else {
                    $('#addItem').style.display = "block";

                    if(item.checked === false){
                        content += `<tr><td><p><label><input type="checkbox"  onclick='listcurentController.Check(${item.id})'/><span></span></label></p></td>`
                    } else {
                        content += `<tr><td><p><label><input type="checkbox" checked="checked"  onclick='listcurentController.Check(${item.id})'/><span></span></label></p></td>`
                    }

                    content += `
                    <td>${item.quantity}</td>
                    <td>${item.label}</td>
                    <td><button class="btn" onclick="listcurentController.edititem(${item.id})"><i class="material-icons">edit</i></button></td>
                    <td><button class="btn" onclick='listcurentController.displayConfirmDelete(${item.id})'><i class="material-icons">delete</i></button></td>`
                }

            }
            $('#itemsTable').innerHTML = content

        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async Check(idIngredient){
        const item = await this.modelItem.getItem(idIngredient)
        if(item.checked === false){
            item.checked = true
            this.toast("Article acheté.")

        } else {
            item.checked = false
            this.toast("L'article n'est pas été acheté. ")

        }
        item.fk_id_list = item.fk_id_list
        this.modelItem.update(item)
        this.displayList()
    }

    async edititem(id) {
        try {
            const object = await this.modelItem.getItem(id)
            if (object === undefined) {
                this.displayServiceError()
                return
            }
            if (object === null) {
                this.displayNotFoundError()
                return
            }
            this.selectedItem = object
            navigate('itemedit')
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    undoDelete() {
        if (this.deletedItem) {
            this.deletedItem.fk_id_list = this.deletedItem.fk_id_list
            this.modelItem.insert(this.deletedItem).then(status => {
                if (status == 200) {
                    this.deletedItem = null
                    this.displayUndoDone()
                    this.displayList()
                }
            }).catch(_ => this.displayServiceError())
        }
    }

    async displayConfirmDelete(id) {
        try {
            const item = await this.modelItem.getItem(id)
            super.displayConfirmDelete(item, async () => {
                switch (await this.modelItem.delete(id)) {
                    case 200:
                        this.deletedItem = item
                        this.displayDeletedMessage("listcurentController.undoDelete()");
                        break
                    case 404:
                        this.displayNotFoundError();
                        break
                    default:
                        this.displayServiceError()
                }
                this.displayList()
            })
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }
}

window.listcurentController = new ListCurentController()
