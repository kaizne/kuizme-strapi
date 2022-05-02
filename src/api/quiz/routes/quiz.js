'use strict';

/**
 * quiz router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// module.exports = createCoreRouter('api::quiz.quiz');

const defaultRouter = createCoreRouter('api::quiz.quiz')

const customRouter = (innerRouter, extraRoutes=[]) => {
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
        'method': 'PATCH',
        'path': '/quiz/:slug/view',
        'handler': 'quiz.logView'
    }
]

module.exports = customRouter(defaultRouter, myExtraRoutes)
