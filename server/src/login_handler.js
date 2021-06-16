const user_query = require("./queries/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = parseInt(process.env.HASH_SALTROUNDS);

async function login({ username, password }) {
    if (!username || !password) throw new Error("no username or password");
    const user = await user_query.find_user_by_name(username);

    if (!user) throw new Error("invalid username");

    console.log(saltRounds);
    console.log(JWT_SECRET);
    const compare = await bcrypt.compare(password, user.password);
    if (compare) {
        user.password = undefined;
        const publicUser = {
            username: user.username,
            id: user.id,
            creationDate: user.creationDate,
        };
        const token = create_token(publicUser);
        publicUser.token = token;
        return publicUser;
    } else {
        throw new Error("Invalid username or password");
    }
}

function create_token(user) {
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: 15 });
    return token;
}

function parse_token(auth) {
    if (!auth) return null;
    return auth.substring(7);
}

function validate_token(token) {
    try {
        const decrypted = jwt.verify(token, JWT_SECRET);
        return decrypted;
    } catch (e) {
        return e.name;
    }
    return null;
}

const handler = {
    login,
    parse_token,
    validate_token,
};

module.exports = handler;
