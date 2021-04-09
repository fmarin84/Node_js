module.exports = class UserAccount {
    constructor(displayName, login, challenge, isactived) {
        this.displayName = displayName
        this.login = login
        this.challenge = challenge
        this.isactived = isactived
    }
}