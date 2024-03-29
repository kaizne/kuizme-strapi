module.exports = (plugin) => {
    plugin.controllers.user.updateLibrary = async (ctx) => {

        const user = ctx.state.user
        if (!user) return ctx.unauthorized()

        let library = user.library
        if (library === null) library = []
        
        const url = ctx.request.body.url

        if (library && library.includes(url)) library = library.filter(elem => elem !== url)
        else library.push(url)
        
        await strapi.query('plugin::users-permissions.user').update({
          where: { id: ctx.state.user.id },
          data: { library: library }
        }).then((res) => {
          ctx.response.status = 200
        })
      }

    plugin.routes['content-api'].routes.push({
        method: 'PATCH',
        path: '/users/updateLibrary',
        handler: 'user.updateLibrary',
        config: {
            prefix: '',
            policies: []
        }
    })

    return plugin
}