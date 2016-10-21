import bcrypt from 'bcrypt';
import Json from 'passport-json';

import jwt from 'jsonwebtoken';

import * as db from '../api/service/db';

export default function (config) {
    const JsonStrategy = Json.Strategy;

    return new JsonStrategy({
        usernameProp: 'user.username',
        passwordProp: 'user.password',
        passReqToCallback: true
    }, (req, username, password, done) => {
        process.nextTick(() => {
            const validateUser = (err, user) => {
                console.log('user from validateUser()', user);
                if (err) { return done(err); }
                if (!user) { return done(null, null, false, { message: `Unknown user: ${username}` }); }

                if (bcrypt.compareSync(password, user.password)) {
                    const currentDate = new Date();
                    const smallExpDate = new Date().setMinutes(currentDate.getMinutes() + 60);
                    const largeExpDate = new Date().setMinutes(currentDate.getMinutes() + 43200);
                    const expDate = !req.body.user.isChecked ? largeExpDate : smallExpDate;
                    const payload = {
                        sub: user.id,
                        role: user.role,
                        expDate
                    };

                    const token = jwt.sign(payload, config.jwtSecret);

                    /* const userData = {
                        name: user.name
                    }; */
                    return done(null, token, user);
                }
                return done(null, null, false, { message: 'Invalid username or password...' });
            };

            db.findUserByEmail(username, validateUser);
        });
    });
}