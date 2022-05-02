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

    /*
    const entity = await strapi.entityService.findMany('api::quiz.quiz', {
        ...query,
        populate: {
            entry: {
                media: true
            }
        }
    })
    */

    const { results } = await this.sanitizeOutput(entity, ctx)
    return this.transformResponse(results[0])
  },

  async logView(ctx) {
    const { slug } = ctx.params
    try {
        const quiz = await strapi.services.quiz.findOne({ slug })
        await strapi.services.quiz.update(
            { id: quiz.id },
            { views: parseInt(quiz.views) + 1 }
        )
        return ctx.send({
            success: true,
        })
        } catch (error) {
            console.error(error)
        return ctx.send({
            success: false,
        })
        }
    }
}))
