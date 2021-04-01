//const serviceBaseUrl = "http://localhost:3333/list"

class ListAPI extends BaseAPIService{
    constructor() {
        super("list")
    }

    getAchived() {
        //return fetchJSON(`${serviceBaseUrl}/archive`)
        return fetchJSON(`${this.url}/archive`, this.token)

    }

    getListsShareByUser() {
        //return fetchJSON(serviceBaseUrl)
        return fetchJSON(`${this.url}/share`, this.token)
    }

    getAll() {
        //return fetchJSON(serviceBaseUrl)
        return fetchJSON(this.url, this.token)
    }
    get(id) {
        //return fetchJSON(`${serviceBaseUrl}/${id}`)
        return fetchJSON(`${this.url}/${id}`, this.token)
    }
    delete(id) {
        this.headers.delete('Content-Type')
        //return fetch(`${serviceBaseUrl}/${id}`, { method: 'DELETE' })
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
