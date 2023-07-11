import express from "express";
import session from "express-session";
import cors from "cors";
import 'dotenv/config'
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import path from "path"
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors({
  origin: "https://keeperappczy.onrender.com",
  credentials: true,
}));
app.set('trust proxy', 1);
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, sameSite: "none" },
  store: MongoStore.create({
    mongoUrl: process.env.ATLAS_URI,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native'
  })
}));
app.use(passport.initialize());
app.use(passport.session());

//Connect to MongoDB Atlas
async function main() {
  try {
    await mongoose.connect(process.env.ATLAS_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}
main().catch(err => console.log(err));

//Mongoose and Passport configure
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  notes: [{title: String, content: String}],
}, { collection: 'userData' });

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("userData",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Handle Requests
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/register", (req, res) => {
  User.register({username: req.body.username}, req.body.password, (err, user) => {
    if (err) {
      res.send({ success: false, errorJson: err });
    } else {
      res.send({ success: true, message: "Success" });
    }
  });
});

app.post("/", (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (info) {
      return res.send({ success: false, errorJson: info });
    } else {
      req.logIn(user, (err) => {
        if (err) {
          return res.send({ success: false, errorJson: err });
        }
        return res.send({ success: true, message: "Login successful" });
      });
    }
  })(req, res);
});

app.get("/app", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.send({ success: false });
  } else {
    User.findByUsername(req.user.username, (err, foundUser) => {
      if(err) {
        console.log(err);
      } else {
        if (foundUser) {
          return res.send({ success: true, savedNote: foundUser.notes });
        }
      }
    });
  }
});

app.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      console.log(err);
      return res.send({ success: false, errorJson: err });
    }
    return res.send({ success: true });
  })
})

app.post("/app/updatenotes", (req, res) => {
  User.findByUsername(req.user.username, (err, foundUser) => {
    if(err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.notes = req.body;
        foundUser.save();
        return res.sendStatus(200);
      }
    }
  });
});

// start the Express server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});