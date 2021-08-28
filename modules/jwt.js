const { sign, verify } = require("jsonwebtoken")

const SECRET = "jimi";

module.exports.createToken = (data) => {
    return sign(data, SECRET)
}

module.exports.checkToken = (token) => {
    try {
        return verify(token, SECRET)
    } catch (error) {
        return false
    }
}
