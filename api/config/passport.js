const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy; // Added GitHub Strategy
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
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const [user] = await User.findOrCreate({
          where: { googleId: profile.id },
          defaults: {
            email: profile.emails[0].value,
            username: profile.emails[0].value,
            avatar: profile.photos[0].value,
            name: profile.displayName,
            provider: "google",
            verified: true,
          },
        });

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0]?.value;
      if (!email) {
        return done(new Error("No email found"), false);
      }

      try {
        const [user] = await User.findOrCreate({
          where: { email },
          defaults: {
            email,
            username: profile.username,
            avatar: profile.photos[0]?.value,
            name: profile.displayName,
            provider: "github",
            verified: true,
          },
        });

        done(null, user);
      } catch (error) {
        console.log("custom error", error);
        done(error);
      }
    }
  )
);

module.exports = passport;
