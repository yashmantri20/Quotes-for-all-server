const gql = require('graphql-tag');

module.exports = gql`
    type Post{
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        comments: [comment]!
        likes: [like]!
        likeCount: Int!
        commentCount: Int!
    }

    type comment{
        id: ID!
        username: String!
        createdAt: String!
        body: String!
    }

    type like{
        id: ID!
        createdAt: String!
        username: String!
    }

    type User{
        id: ID!
        username: String!
        email: String!
        token: String!
        createdAt: String!
        followers: [follower]!
        following: [following]!
        followCount: Int!
        followingCount: Int!
    }

    type follower{
        username: String!
    }

    type following{
        username: String!
    }

    input RegisterInput {
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
    }

    type Query{
        getPosts: [Post]
        getPost(postId: ID!): Post
        getFollowers(username: String!): User
    }
    
    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String!): Post
        deletePost(postId: ID!): String!
        createcomment(postId: ID!, body: String!): Post!
        deletecomment(postId: ID!,commentId: ID!): Post!
        likePost(postId: ID!): Post!
        follow(username: String!): User!
    }
`;