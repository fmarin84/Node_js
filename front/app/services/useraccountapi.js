class UserAccountAPI extends BaseAPIService {
    constructor() {
        super("useraccount")
    }
    authenticate(login, password) {
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/authenticate`, {
            method: "POST",
            headers: this.headers,
            body: `login=${login}&password=${password}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }

    register(name, login, password){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/register`, {
            method: "POST",
            headers: this.headers,
            body: `name=${name}&login=${login}&password=${password}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }

    getByLogin(login) {
        //return fetchJSON(`${serviceBaseUrl}/${id}`)
        return fetchJSON(`${this.url}/search/${login}`, this.token)
    }

    get(id) {
        //return fetchJSON(`${serviceBaseUrl}/${id}`)
        return fetchJSON(`${this.url}/${id}`, this.token)
    }

}
