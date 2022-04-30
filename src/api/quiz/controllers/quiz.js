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
    // const entity = await strapi.service('api::quiz.quiz').find(query)

    const entity = await strapi.service('api::quiz.quiz', {
        ...query,
        populate: {
            entry: {
                populate: {
                    media: true
                }
            }
        }
    })

    const { results } = await this.sanitizeOutput(entity, ctx)
    return this.transformResponse(results[0])
  }
}))
