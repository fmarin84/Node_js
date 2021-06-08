
class ItemAPI extends BaseAPIService{

    constructor() {
        super("item")
    }

    getAllByList(listId){
        return fetchJSON(`${this.url}/list/${listId}`, this.token)
    }

    getShare(listId) {
        return fetchJSON(`${this.url}/share/${listId}`, this.token)
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

    insert(item) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(item)
        })
    }

    update(item) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(item)
        })
    }
}
