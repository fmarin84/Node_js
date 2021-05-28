//const serviceBaseUrl = "http://localhost:3333/list"

class ListAPI extends BaseAPIService{
    constructor() {
        super("list")
    }

    getAchived() {
        return fetchJSON(`${this.url}/archive`, this.token)
    }

    getListsShareByList(listId) {
        return fetchJSON(`${this.url}/share/${listId}`, this.token)
    }

    getListsShareByUser() {
        return fetchJSON(`${this.url}/share`, this.token)
    }

    getListsByUser() {
        return fetchJSON(`${this.url}/user`, this.token)
    }

    getUserShare(listId){
        return fetchJSON(`${this.url}/share/user/${listId}`, this.token)
    }

    getUsersList(listId){
        return fetchJSON(`${this.url}/share/users/${listId}`, this.token)
    }
    getAll() {
        return fetchJSON(this.url, this.token)
    }
    get(id) {
        return fetchJSON(`${this.url}/${id}`, this.token)
    }
    delete(id) {
        this.headers.delete('Content-Type')
        return fetch(`${this.url}/${id}`, { method: 'DELETE', headers: this.headers })
    }
    insert(list) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(list)
        })
    }
    update(list) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(list)
        })
    }
}
