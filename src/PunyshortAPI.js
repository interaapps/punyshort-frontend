import {Cajax} from "cajaxjs";

export default class PunyshortAPI extends Cajax {
    constructor(baseUrl) {
        super(baseUrl || 'punyshort.apis.intera.dev')
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
        return this.json(this.get("/v1/user"))
    }

    shorten(data) {
        return this.json(this.post("/v1/shorten-links", data))
    }

    getShortenLink(id) {
        return this.json(this.get(`/v1/shorten-links/${id}`))
    }

    getShortenLinks(query = {}) {
        return this.json(this.get("/v1/shorten-links", query))
    }

    getShortenLinksStats(id, category, query = {}) {
        return this.json(this.get(`/v1/shorten-links/${id}/stats/${category}`, query))
    }

    getDomains(query = {}) {
        return this.json(this.get("/v1/domains", query))
    }
}