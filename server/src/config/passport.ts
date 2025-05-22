import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

const GoogleStrategy = passportGoogle.Strategy;

 // Debug
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    (accessToken, refreshToken, profile, done) => {
      
      return done(null, profile);
    }
  )
);

export default passport;