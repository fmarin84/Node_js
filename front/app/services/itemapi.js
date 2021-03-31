const serviceBaseUrlItem = "http://localhost:3333/item"

class ItemAPI {
    getAllByList(idList){


        return fetchJSON(serviceBaseUrlItem)

    }

    getAll() {
        return fetchJSON(serviceBaseUrlItem)
    }
    get(id) {
        return fetchJSON(`${serviceBaseUrlItem}/${id}`)
    }
    delete(id) {
        return fetch(`${serviceBaseUrlItem}/${id}`, { method: 'DELETE' })
    }
    insert(item) {
        return fetch(serviceBaseUrlItem, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        })
    }
    update(item) {
        return fetch(serviceBaseUrlItem, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        })
    }
}
