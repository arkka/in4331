module.exports = {
    app: {
        name: 'IN4331: Movie Database with MongoDB',
        description: '',
        keywords: '',
        port: process.env.PORT || 3000,
    },

    security: {
        sessionSecret: 'secrettokenhere'
    }

}