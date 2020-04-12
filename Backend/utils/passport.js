var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
var { secret } = require("./config");
const Students = require('../Models/StudentModel');
const Company = require('../Models/CompanyModel');
// const Users = require('../Models/UserModel');
function auth() {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: secret
    };
    passport.use(
        new JwtStrategy(opts, (jwt_payload, callback) => {
            const user_id = jwt_payload._id;
            console.log(user_id)
            Company.createModel().findById(user_id, (err, results) => {
                if (err) {
                    return callback(err, false);
                }
                if (results) {
                    callback(null, results);
                }
                else {
                    callback(null, false);
                }
            });
        })
    )
}
function studauth() {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: secret
    };
    passport.use(
        new JwtStrategy(opts, (jwt_payload, callback) => {
            const user_id = jwt_payload._id;
            console.log(user_id)
        //     if (jwt_payload.persona=="company"){
        //     Company.createModel().findById(user_id, (err, results) => {
        //         if (err) {
        //             return callback(err, false);
        //         }
        //         if (results) {
        //             callback(null, results);
        //         }
        //         else {
        //             callback(null, false);
        //         }
        //     })
        // }
            // if (jwt_payload.persona=="student"){
            Students.createModel().findById(user_id, (err, results) => {
                if (err) {
                    return callback(err, false);
                }
                if (results) {
                    callback(null, results);
                }
                else {
                    callback(null, false);
                }
            });
        // }
        })
    )
}
exports.studauth = studauth;
exports.auth = auth;
exports.checkAuth = passport.authenticate("jwt", { session: false });