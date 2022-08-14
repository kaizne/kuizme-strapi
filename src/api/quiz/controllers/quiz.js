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
    const difficulty = query.difficulty
    if (!query.filters) query.filters = {}
    query.filters.slug = { '$eq': slug }
    const entity = await strapi.entityService.findMany('api::quiz.quiz', {
        fields: ['slug', 'type', 'info', 'conclusionStats'], 
        filters: { slug: slug },
        populate: { entry: true, section: true }
    })
    const response = entity[0]
    let newStats = null
    if (!response.conclusionStats) {
        if (response.type === 0 || response.type === 1) {
            newStats = {}
            newStats['default'] = {}
            const len = Object.keys(response.info).length
            for (let i = 1; i <= len; ++i)
                newStats['default'][i] = 0
        } else if (response.type === 2) {
            newStats = {}
            if (response.entry.length > 0) {
                newStats = {}
                newStats['default'] = {}
                const len = response.entry.length
                for (let i = 1; i <= len; ++i)
                    newStats['default'][i] = 0
            } else {
                newStats = {}
                response.section.forEach(section => {
                    newStats[section.difficulty] = {}
                    for (let i = 1; i <= 10; ++i)
                        newStats[section.difficulty][i] = 0
                })
            }
        }
    } else {
        newStats = response.conclusionStats
        if (response.type === 0 || response.type === 1) {
            newStats['default'][key]++
        }
        else if (response.type === 2) {
            if (response.entry.length > 0) {
                newStats['default'][key]++
            } else {
                newStats[difficulty][key]++
            }
        }
    }
    return await strapi.query('api::quiz.quiz')
        .update({
            where: { slug: response.slug },
            data: { conclusionStats: newStats }
        })
  }
}))
