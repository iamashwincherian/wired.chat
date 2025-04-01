const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models");

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          where: { email, provider: "local" },
        });

        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        const isValid = await user.validatePassword(password);

        if (!isValid) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        const [user] = await User.findOrCreate({
          where: { googleId: profile.id },
          defaults: {
            email: profile.emails[0].value,
            username: profile.displayName,
            provider: "google",
            avatar: profile.photos[0].value,
          },
        });

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = passport;
