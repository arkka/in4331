module.exports = {
    app: {
        name: 'IN4331: Movie Database with Postgres',
        description: '',
        keywords: '',
        port: process.env.PORT || 3000,
    },

    security: {
        sessionSecret: 'secrettokenhere'
    }

}
