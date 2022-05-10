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
  }
}))
