const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { AuthenticationError} = require('apollo-server');
const checkAuth = require('../../util/check-auth')
const {
    validateRegisterInput,
    validateLoginInput
} = require('../../util/validators');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const User = require('../../models/User');
const Scholar = require('../../models/Scholar');

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name
        },
        SECRET_KEY,
        { expiresIn: '1h' }
    );
}

const removeEmpty = obj => {
    Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
};

module.exports = {
    Query: {
        async login(_, { email, password }) {
            const { errors, valid } = validateLoginInput(email, password);

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({ email });

            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong crendetials';
                throw new UserInputError('Wrong crendetials', { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };
        }
    },
    Mutation: {

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
                throw new UserInputError('Errors', { errors });
            }
            // TODO: Make sure user doesnt already exist
            const user = await User.findOne({ email });
            if (user) {
                throw new UserInputError('Email is taken', {
                    errors: {
                        email: 'This email is taken'
                    }
                });
            }
            // hash password and create an auth token
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({
                email,
                name,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                role:false
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            };
        },
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
                throw new AuthenticationError('Permission denied');

            const user = await User.findById(_id);
            const updateParameters = removeEmpty(arguments[1]);
            if (updateParameters.email) {
                const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
                if (!email.match(regEx)) {
                    throw new UserInputError('Email must be a valid email address');
                }
            }
            user.assign(updateParameters);
            return await user.save();
        },
        
    }
    
};