import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import AppleStrategy from 'passport-apple';
import dotenv from "dotenv";
import { prisma } from "../../database/db/db.connect.js";
dotenv.config();

export const google_auth = passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
      callbackURL: `http://localhost:${process.env.PORT}/auth/google/redirect`,
      passReqToCallback: true,
    },

    async function (request, accessToken, refreshToken, profile, done) {
      try {
        const email = profile.emails[0].value;

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              fullName: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
              googleId: profile.id, 
              role: role,
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// export const apple_auth = passport.use(
//   new AppleStrategy({
//     clientID: process.env.APPLE_CLIENT_ID,
//     clientSecret: process.env.APPLE_CLIENT_SECRET,
//     callbackURL: `http://localhost:${process.env.PORT}/auth/apple/callback`,
//     keyID: "",
//     privateKeyLocation: "",
//     passReqToCallback: true
//   })
// )