import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import bcrypt from 'bcryptjs';
import pool from '../db.js';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID;
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET;
const API_URL = process.env.API_URL || 'http://localhost:5000';

const findOrCreateUser = async (email, name, provider) => {
    try {
        // Check if user exists
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            return rows[0];
        }

        // Create new user
        // Generate a random password since they are using OAuth
        const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const [result] = await pool.execute(
            'INSERT INTO users (email, name, password) VALUES (?, ?, ?)',
            [email, name, hashedPassword]
        );

        return {
            id: result.insertId,
            email,
            name,
            password: hashedPassword
        };
    } catch (error) {
        throw error;
    }
};

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${API_URL}/api/auth/google/callback`
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const name = profile.displayName;
                const user = await findOrCreateUser(email, name, 'google');
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    ));
}

if (MICROSOFT_CLIENT_ID && MICROSOFT_CLIENT_SECRET) {
    passport.use(new MicrosoftStrategy({
        clientID: MICROSOFT_CLIENT_ID,
        clientSecret: MICROSOFT_CLIENT_SECRET,
        callbackURL: `${API_URL}/api/auth/microsoft/callback`,
        scope: ['user.read']
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const name = profile.displayName;
                const user = await findOrCreateUser(email, name, 'microsoft');
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    ));
}

export default passport;
