const postsResolvers = require('./posts')
const usersResolvers = require('./users')
const commentResolvers = require('./comment')

module.exports = {
    Post:{
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
    },

    User:{
        followCount: (parent) => parent.followers.length,
        followingCount: (parent) => parent.following.length
    },

    Query:{
        ...postsResolvers.Query,
        ...usersResolvers.Query
    },

    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentResolvers.Mutation
    }
}