class NotificationAPI extends BaseAPIService {
    constructor() {
        super("notification")
    }

    getNotificationByUser(userId){
        return fetchJSON(`${this.url}/user/${userId}`, this.token)
    }

    getById(notificationId){
        return fetchJSON(`${this.url}/${notificationId}`, this.token)
    }

    // insert(listId, userId,state) {
    //     this.headers.set( 'Content-Type', 'application/json' )
    //     return fetch(`${this.url}/${listId}/${userId}/${state}`, { method: 'POST', headers: this.headers })
    // }
    update(notification) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(notification)
        })
    }

}