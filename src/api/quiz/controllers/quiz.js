'use strict'

/**
 *  quiz controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::quiz.quiz', ({ strapi }) =>  ({
  async findOne(ctx) {
    const { id: slug } = ctx.params
    const { query } = ctx
    if (!query.filters) query.filters = {}
    query.filters.slug = { '$eq': slug }
    const entity = await strapi.service('api::quiz.quiz').find(query)
    const { results } = await this.sanitizeOutput(entity, ctx)
    return this.transformResponse(results[0])
  },

  async incrementPlay(ctx) {
    const { slug } = ctx.params
    const { query } = ctx
    if (!query.filters) query.filters = {}
    query.filters.slug = { '$eq': slug }
    const entity = await strapi.service('api::quiz.quiz').find(query)
    const { results } = await this.sanitizeOutput(entity, ctx)
    const response = this.transformResponse(results[0])
    return await strapi.query('api::quiz.quiz')
        .update({
            where: {slug: response.data.attributes.slug},
            data: {plays: parseInt(response.data.attributes.plays) + 1}
        })
  },

  async incrementLike(ctx) {
    const { slug } = ctx.params
    const { query } = ctx
    if (!query.filters) query.filters = {}
    query.filters.slug = { '$eq': slug }
    const entity = await strapi.service('api::quiz.quiz').find(query)
    const { results } = await this.sanitizeOutput(entity, ctx)
    const response = this.transformResponse(results[0])
    return await strapi.query('api::quiz.quiz')
        .update({
            where: {slug: response.data.attributes.slug},
            data: {likes: parseInt(response.data.attributes.likes) + 1}
        })
  },

  async decrementLike(ctx) {
    const { slug } = ctx.params
    const { query } = ctx
    if (!query.filters) query.filters = {}
    query.filters.slug = { '$eq': slug }
    const entity = await strapi.service('api::quiz.quiz').find(query)
    const { results } = await this.sanitizeOutput(entity, ctx)
    const response = this.transformResponse(results[0])
    return await strapi.query('api::quiz.quiz')
        .update({
            where: {slug: response.data.attributes.slug},
            data: {likes: parseInt(response.data.attributes.likes) - 1}
        })
  },

  async updateConclusionStats(ctx) {
    const { slug } = ctx.params
    const { query } = ctx
    const key = query.key
    if (!query.filters) query.filters = {}
    query.filters.slug = { '$eq': slug }
    const entity = await strapi.service('api::quiz.quiz').find(query)
    const { results } = await this.sanitizeOutput(entity, ctx)
    const response = this.transformResponse(results[0])
    let newStats = null
    if (!response.data.attributes.conclusionStats) {
        if (response.data.attributes.type === 1) {
            newStats = {}
            const len = Object.keys(response.data.attributes.info).length
            for (let i = 1; i <= len; ++i)
                newStats[i] = 0
            newStats[key]++
        }
    } else {
        newStats = response.data.attributes.conclusionStats
        newStats[key]++
    }
    return await strapi.query('api::quiz.quiz')
        .update({
            where: {slug: response.data.attributes.slug},
            data: {conclusionStats: newStats}
        })
  }
}))
