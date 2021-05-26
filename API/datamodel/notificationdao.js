const BaseDAO = require('./basedao')

module.exports = class notificationdao extends BaseDAO {
    constructor(db) {
        super(db,"notification")
    }

    insert(notification) {
        return this.db.query("INSERT INTO notification(titre,text,islue,fk_useraccount_id, listshareid) VALUES ($1,$2,$3,$4,$5)",
            [notification.titre,notification.text, false, notification.fk_useraccount_id, notification.listshareid])
    }

    getNotificationByListShareId(listId) {
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT notification.* FROM notification, share WHERE share.fk_id_list=notification.listshareid and listshareid=$1`, [ listId ])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    getAllNotifications(userId) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM notification WHERE fk_useraccount_id=$1 ORDER BY created_at desc", [userId])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    getNotificationByUser(userId){
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM notification WHERE fk_useraccount_id=$1 and islue=false ORDER BY created_at desc", [userId])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    countNotifications(userId){
        return new Promise((resolve, reject) =>
            this.db.query("SELECT count(*) FROM notification WHERE fk_useraccount_id=$1 and islue=false ", [userId])
                .then(res => resolve(res.rows[0]['count']))
                .catch(e => reject(e)))
    }

    update(notification) {
        return this.db.query("UPDATE notification SET titre=$2, text=$3, islue=$4 WHERE id=$1",
            [notification.id, notification.titre, notification.text, notification.islue ])
    }
}