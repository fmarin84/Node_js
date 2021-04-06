//const serviceBaseUrlItem = "http://localhost:3333/item"

class ItemAPI extends BaseAPIService{

    constructor() {
        super("item")
    }

    getAllByList(idList){
        //return fetchJSON(serviceBaseUrlItem)
        return fetchJSON(this.url, this.token)
    }

    getShare(listId) {
        //return fetchJSON(serviceBaseUrlItem)
        return fetchJSON(`${this.url}/share/${listId}`, this.token)
    }

    getAll() {
        //return fetchJSON(serviceBaseUrlItem)
        return fetchJSON(this.url, this.token)
    }
    get(id) {
        //return fetchJSON(`${serviceBaseUrlItem}/${id}`)
        return fetchJSON(`${this.url}/${id}`, this.token)

    }
    delete(id) {
        this.headers.delete('Content-Type')
        //return fetch(`${serviceBaseUrlItem}/${id}`, { method: 'DELETE' })
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
