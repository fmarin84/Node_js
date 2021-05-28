class PaymentAPI extends BaseAPIService {
    constructor() {
        super("payment")
    }

    getByUserId(userId){
        return fetchJSON(`${this.url}/${userId}`, this.token)
    }

    insert(payment) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(payment)
        })
    }

}