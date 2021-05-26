class NotificationAPI extends BaseAPIService {
    constructor() {
        super("notification")
    }

    getAll(userId){
        return fetchJSON(`${this.url}/user/all/${userId}`, this.token)
    }

    getNotificationByUser(userId){
        return fetchJSON(`${this.url}/user/${userId}`, this.token)
    }

    getById(notificationId){
        return fetchJSON(`${this.url}/${notificationId}`, this.token)
    }

    getNotificationByListShareId(listId){
        return fetchJSON(`${this.url}/list/${listId}`, this.token)
    }

    countNotification(userId){
        return fetchJSON(`${this.url}/count/${userId}`, this.token)
    }

    insert(notification) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(notification)
        })
    }

    update(notification) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(notification)
        })
    }

}