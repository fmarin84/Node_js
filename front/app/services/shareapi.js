class ShareAPI extends BaseAPIService {
    constructor() {
        super("share")
    }

    delete(listId, userId) {
        this.headers.delete('Content-Type')
        return fetch(`${this.url}/delete/${listId}/${userId}`, { method: 'DELETE', headers: this.headers })

    }

    insert(listId, userId,state) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(`${this.url}/${listId}/${userId}/${state}`, { method: 'POST', headers: this.headers })

        /*
        return fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(listId, userId,state)
        })
         */
    }
    update(listId, userId,state) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(listId, userId,state)
        })
    }


   /*
    getByLogin(login) {
        //return fetchJSON(`${serviceBaseUrl}/${id}`)
        return fetchJSON(`${this.url}/search/${login}`, this.token)
    }
    */

}