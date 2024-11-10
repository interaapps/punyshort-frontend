import {Cajax} from "cajaxjs";

export default class PunyshortAPI extends Cajax {
    constructor(baseUrl) {
        super(baseUrl || 'punyshort.apis.intera.dev')

        this.promiseInterceptor = this.json
    }

    async json(q) {
        return await (await q).json()
    }

    async pagination(q) {
        const res = await q

        return {
            data: await res.json(),
            pagination: {
                total: res.xhr.getResponseHeader('PAGINATION_TOTAL'),
                limit: res.xhr.getResponseHeader('PAGINATION_LIMIT'),
                page: res.xhr.getResponseHeader('PAGINATION_PAGE'),
            }
        }
    }

    getUser() {
        return this.get("/v1/user")
    }

    shorten(data) {
        return this.post("/v1/shorten-links", data)
    }

    update(id, data) {
        return this.put(`/v1/shorten-links/${id}`, data)
    }

    getShortenLink(id) {
        return this.get(`/v1/shorten-links/${id}`)
    }

    getShortenLinks(query = {}) {
        return this.get("/v1/shorten-links", query)
    }

    getShortenLinksStats(id, category, query = {}) {
        return this.get(`/v1/shorten-links/${id}/stats/${category}`, query)
    }

    createDomain(data) {
        return this.post("/v1/domains", data)
    }

    getDomains(query = {}) {
        return this.get("/v1/domains", query)
    }

    getDomain(id, query = {}) {
        return this.get(`/v1/domains/${id}`, query)
    }

    deleteDomain(id, query = {}) {
        return this.delete(`/v1/domains/${id}`, query)
    }


    getWorkspaces(query = {}) {
        return this.get("/v1/workspaces", query)
    }

    createWorkspaces(body = {}) {
        return this.post("/v1/workspaces", body)
    }

    getWorkspace(id) {
        return this.get(`/v1/workspaces/${id}`)
    }

    getWorkspaceDomains(id, params = {}) {
        return this.get(`/v1/workspaces/${id}/domains`, params)
    }
    addWorkspaceDomains(id, domainId) {
        return this.post(`/v1/workspaces/${id}/domains`, {domain_id: domainId})
    }

    removeWorkspaceDomain(id, domainId) {
        return this.delete(`/v1/workspaces/${id}/domains/${domainId}`)
    }

    getWorkspaceUsers(id, params = {}) {
        return this.get(`/v1/workspaces/${id}/users`, params)
    }

    inviteUserToWorkspace(id, email) {
        return this.post(`/v1/workspaces/${id}/users`, {email})
    }

    acceptWorkspaceInvitation(id, userId) {
        return this.post(`/v1/workspaces/${id}/users/${userId}/accept`)
    }

    removeWorkspaceUser(id, userId) {
        return this.delete(`/v1/workspaces/${id}/users/${userId}`)
    }

    updateWorkspaceUser(id, userId, body) {
        return this.put(`/v1/workspaces/${id}/users/${userId}`, body)
    }
}