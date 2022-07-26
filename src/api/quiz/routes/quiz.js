'use strict'

/**
 * quiz router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories
const defaultRouter = createCoreRouter('api::quiz.quiz')

const customRouter = (innerRouter, extraRoutes = []) => {
    let routes
    return {
        get prefix() {
            return innerRouter.prefix
        },
        get routes() {
            if (!routes) routes = innerRouter.routes.concat(extraRoutes)
            return routes
        }
    }
}

const myExtraRoutes = [
    {
        method: 'PATCH',
        path: '/quizzes/:slug/play',
        handler: 'api::quiz.quiz.incrementPlay',
    },
    {
        method: 'PATCH',
        path: '/quizzes/:slug/like',
        handler: 'api::quiz.quiz.incrementLike',
    },
    {
        method: 'PATCH',
        path: '/quizzes/:slug/dislike',
        handler: 'api::quiz.quiz.decrementLike',
    },
    {
        method: 'PATCH',
        path: '/quizzes/:slug/conclusion',
        handler: 'api::quiz.quiz.updateConclusionStats',
    },
]

module.exports = customRouter(defaultRouter, myExtraRoutes)
