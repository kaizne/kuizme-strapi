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
            if (!routes) routes = extraRoutes.concat(innerRouter.routes)
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
    }
]

module.exports = customRouter(defaultRouter, myExtraRoutes)
