module.exports = {
    app: {
        name: 'IN4331: Movie Database with Neo4j',
        description: '',
        keywords: '',
        port: process.env.PORT || 3200,
    },

    security: {
        sessionSecret: 'secrettokenhere'
    }

}
