const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ApolloError } = require('apollo-server');
const checkAuth = require('../../util/check-auth')
const {
    validateRegisterInput,
    validateLoginInput
} = require('../../util/validators');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const User = require('../../models/User');
const Paper = require('../../models/Paper');
const Scholar = require('../../models/Scholar');

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name
        },
        SECRET_KEY,
        { expiresIn: '1000h' }
    );
}


function removeEmpty(obj) {
    let newObj = {};
    for (const key in obj) {
        if (obj[key] != null) {
            newObj[key] = obj[key];
        }
    }
    return obj;
};

module.exports = {
    Query: {
        Users: async (_, { params, page, perPage }, context) => {
            currentId = checkAuth(context).id;
            user = await User.findById(currentId);
            if (!user.role)
                throw new ApolloError("您没有权限调用该接口！")
            if (!page)
                page = 1;
            if (!perPage)
                perPage = 20;
            const keywords = params.trim().split(' ').filter(el => el.length > 0);
            const regex = new RegExp(keywords.join("|"));
            const query = await User.find({ name: { $regex: regex, $options: "i" } });
            const numOfPages = Math.ceil(query.length / perPage);
            const users = await User.find({
                name: {
                    $regex: regex,
                    $options: "i"
                }
            }).skip((page - 1) * perPage).limit(perPage);
            return { users, numOfPages };
        },
        async login(_, { email, password }) {
            const { errors, valid } = validateLoginInput(email, password);

            if (!valid) {
                throw new ApolloError('Errors', { errors });
            }

            const user = await User.findOne({ email });

            if (!user) {
                errors.general = 'User not found';
                throw new ApolloError('未找到该用户', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong crendetials';
                throw new ApolloError('认证错误，请确认密码输入正确', { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };
        },
        async allFavorites(_, __, context) {
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            const results = [];
            const collection = user.paperCollection;
            collection.sort().reverse();
            for (const each of collection) {
                const paper = await Paper.findById(each.paperId);
                results.push(paper);
            }
            return results;
        },
        async following(_, __, context) {
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            const results = [];
            const collection = user.schCollection;
            collection.sort().reverse();
            for (const each of collection) {
                const scholar = await Scholar.findById(each.scholarId);
                results.push(scholar);
            }
            return results;
        },
        async getUserInfo(_, {id}) {
            const user = await User.findById(id);
            return { name, id, avatar, email } = user;
        },
        async currentUser(_, __, context) {
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            return { name, id, avatar, email } = user;
        },
        async getUsers() {

            const { body } = await client.search({
                index: 'users',
                // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
                body: {
                    query: {
                        match: { name: 'aa' }
                    }
                }
            })
            //console.log(body.hits.hits)
            let ids = [];
            await body.hits.hits.forEach(async function (result) {
                ids.push(result._id);
            })

            records = await User.find().where('_id').in(ids).exec();
            return records;
        },
    },
    Mutation: {
        async registerAdmin(
            _, { params }
        ) {
            const { name, email, password } = params;
            // Validate user data
            const { valid, errors } = validateRegisterInput(
                name,
                email,
                password,
            );
            if (!valid) {
                throw new ApolloError('Errors', { errors });
            }
            // TODO: Make sure user doesnt already exist
            const user = await User.findOne({ email });
            if (user) {
                throw new ApolloError('邮箱已注册');
            }
            // hash password and create an auth token
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({
                email,
                name,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                role: true
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            };
        },
        async register(
            _, { params }
        ) {
            const { name, email, password } = params;
            // Validate user data
            const { valid, errors } = validateRegisterInput(
                name,
                email,
                password,
            );
            if (!valid) {
                throw new ApolloError('Errors', { errors });
            }
            // TODO: Make sure user doesnt already exist
            const user = await User.findOne({ email });
            if (user) {
                throw new ApolloError('邮箱已注册');
            }
            // hash password and create an auth token
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({
                email,
                name,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                role: false
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            };
        },
        changePassword: async (_, { oldPassword, newPassword }, context) => {
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            const match = await bcrypt.compare(oldPassword, user.password)
            if (!match) {
                throw new ApolloError("wrong password!");
            }
            else {
                const newHashedPassword = await bcrypt.hash(newPassword, 12);
                user.password = newHashedPassword;
                await user.save();
                return user;
            }
        }
        ,
        updateUserInfo: async function (_, {
            _id,
            name,
            password,
            email,
            avatar,
            personalProfile,
            role
        }, context) {

            const currentId = checkAuth(context).id;
            const isRoot = !!((await User.findById(currentId)).role);

            if (!_id)
                _id = currentId;
            if (!isRoot && currentId != _id || !isRoot && role)
                throw new ApolloError('权限不足，不允许进行该操作！');

            const user = await User.findById(_id);
            const updateParameters = removeEmpty(arguments[1]);
            console.log(arguments[1], updateParameters);
            if (!!updateParameters.email) {
                const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!email.match(regEx)) {
                    throw new ApolloError('请提供有效邮箱！');
                }
            }
            Object.assign(user, updateParameters);
            await user.save();
            return user;
        },
        deleteUserById: async (_, { userId }, context) => {
            const currentId = checkAuth(context).id;
            const currentUser = await User.findById(currentId);
            if (currentUser.role) {
                const user = await User.findById(userId);
                if (user) {
                    await user.delete();
                    return true;
                } else throw new ApolloError('用户不存在！');
            } else throw new ApolloError('权限不足！');
        }
    }
};