'use strict'

/**
 *  quiz controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::quiz.quiz', ({ strapi }) =>  ({
  async findOne(ctx) {
    const { quiz } = ctx.params
    const { query } = ctx
    const entity = await strapi.service('api::quiz.quiz').findOne(quiz, query)
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
    return this.transformResponse(sanitizedEntity)
  }
}))
