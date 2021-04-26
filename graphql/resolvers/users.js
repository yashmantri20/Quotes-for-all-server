const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');
const {SECRET_KEY} = require('../../config');
const checkAuth = require('../../check-auth');

const {validateRegisterInput,validateLoginInput} = require('../../validation')


function generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      SECRET_KEY
    );
  }

module.exports = {
    Query:{
        async getFollowers(_, { username }) {
            try {
              const user = await User.findOne({username});
              if (user) {
                return user;
              } else {
                throw new Error('User not found');
              }
            } catch (err) {
              throw new Error(err);
            }
        }
    },

    Mutation:{

        async follow(_, {username},context){

            const users = checkAuth(context);
            const name = users.username
            
            const user = await User.findOne({username});
            const user1 = await User.findOne({username: name})

            if(users){
                if(user.followers.find(follower => follower.username === name)){
                    user.followers = user.followers.filter(follower => follower.username !== users.username)
                    user1.following = user1.following.filter(follower => follower.username !== user.username)
                }
                else{
                    user.followers.push({
                        username: name
                    })
                    user1.following.push({
                        username: user.username
                    })
                }
                await user.save();
                await user1.save();
                return user,user1;
            }
            else{
                throw new UserInputError('Please Login');
            }
        },

        async login(_,{username,password}){
            const {errors,valid} = validateLoginInput(username, password);
            if(!valid){
                throw new UserInputError('Errors',{
                    errors
                })
            }

            const user = await User.findOne({username});
            if(!user){
                errors.general = "User not found";
                throw new UserInputError('user not found',{
                    errors
                })
            }

            const match = await bcrypt.compare(password,user.password);
            if(!match){
                errors.general = "Wrong Data";
                throw new UserInputError('Wrong Data',{
                    errors
                })
            }

            const token = generateToken(user);
            return{
                ...user._doc,
                id: user._id,
                token
            };
        },


        async register(_,{registerInput : { username, email, password, confirmPassword}},context,info){

            const {errors,valid} = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid){
                throw new UserInputError('Errors',{
                    errors
                })
            }

            const user = await User.findOne({username})
            const email1 = await User.findOne({email})
            if(user || email1)
            {
                throw new UserInputError('Username or Email is already taken',{
                    errors:{
                        username: "Username or Email is already taken"
                    }
                })
            }

            password = await bcrypt.hash(password,12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return{
                ...res._doc,
                id: res._id,
                token
            };
        },
    }
}