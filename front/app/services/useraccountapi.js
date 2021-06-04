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

    reauthenticate(login, password) {
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/reauthenticate`, {
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
        return new Promise((resolve, reject) => fetch(`${this.url}/inscription`, {
            method: "POST",
            headers: this.headers,
            body: `login=${login}&password=${password}&pseudo=${name}`
        }).then(res => {
            resolve(res.status)
        }).catch(err => reject(err)))
    }

    getValidation(token){
        return fetchJSON(`${this.url}/token/${token}`)
    }

    reSendMailValidation(login){
        return fetchJSON(`${this.url}/sendMail/${login}`)
    }

    getValidationChangePassword(token,password){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/forget`, {
            method: "POST",
            headers: this.headers,
            body: `token=${token}&password=${password}`
        }).then(res => {
            resolve(res.status)
        }).catch(err => reject(err)))
    }

    sendLink(login){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/sendLink`, {
            method: "POST",
            headers: this.headers,
            body: `login=${login}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }

    sendEmailSubscrib(login){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/sendEmailSubscrib`, {
            method: "POST",
            headers: this.headers,
            body: `login=${login}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }

    sendEmailForgetPwd(login){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/sendEmailForgetPwd`, {
            method: "POST",
            headers: this.headers,
            body: `login=${login}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }

    getByLogin(login) {
        return fetchJSON(`${this.url}/search/${login}`, this.token)
    }

    getByLoginAbonne(login, isAbonne) {
        return fetchJSON(`${this.url}/search/${login}/${isAbonne}`, this.token)
    }

    getRoleToUser(userId) {
        return fetchJSON(`${this.url}/roleuser/${userId}`, this.token)
    }

    getRolesNotToUser(userId) {
        return fetchJSON(`${this.url}/rolenotuser/${userId}`, this.token)
    }

    getThisUser() {
        return fetchJSON(`${this.url}/`, this.token)
    }
    get(id) {
        return fetchJSON(`${this.url}/${id}`, this.token)
    }

    update(user) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(user)
        })
    }

    updatePwd(user) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(`${this.url}/password`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(user)
        })
    }

    getAllUsers() {
        return fetchJSON(`${this.url}/users`, this.token)
    }

    deleteRoleUser(id, roleId){
        this.headers.delete('Content-Type')
        return fetch(`${this.url}/delete/role_user/${id}/${roleId}`, { method: 'DELETE', headers: this.headers })
    }

    addRoleUser(id, roleId){
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(`${this.url}/add/role_user/${id}/${roleId}`, {
            method: 'POST',
            headers: this.headers
        })
    }

}
