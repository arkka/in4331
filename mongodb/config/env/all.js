module.exports = {
    app: {
        name: 'IN4331: Movie Database with MongoDB',
        description: '',
        keywords: '',
        port: process.env.PORT || 3000,
    },

    mongodb: 'mongodb://127.0.0.1/in4331',

    security: {
        sessionSecret: 'secrettokenhere'
    }

}
