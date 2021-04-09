class ArchiveController extends BaseController {
    constructor() {
        super()
        this.tableAllLists = $('#tableAllLists')
        this.tableBodyAllLists = $('#tableBodyAllLists')
        this.displayAllListsArchive()
    }

    async displayAllListsArchive() {
        let content = ''
        try {
            for (const list of await this.model.getAchived()) {
                const date = list.date.toLocaleDateString()
                content += `<tr>
                    <td>
                    <a  onclick="navigateParams('listcurent',${list.id})">${list.shop}</a>
                    </td>
                    <td>${date}</td>
                    <td class="icon">
                    <button class="btn" onclick="archiveController.displayConfirmDelete(${list.id})"><i class="material-icons">delete</i></button>                   
                    </td></tr>`
            }

            this.tableBodyAllLists.innerHTML = content
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
                    this.displayAllListsArchive()
                }
            }).catch(_ => this.displayServiceError())
        }
    }

    async displayConfirmDelete(id) {
        try {
            const list = await this.model.getList(id)
            super.displayConfirmDelete(list, async () => {
                switch (await this.model.delete(id)) {
                    case 200:
                        this.deletedList = list
                        this.displayDeletedMessage("archiveController.undoDelete()");
                        break
                    case 404:
                        this.displayNotFoundError();
                        break
                    default:
                        this.displayServiceError()
                }
                this.displayAllListsArchive()
            })
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

}

window.archiveController = new ArchiveController()
