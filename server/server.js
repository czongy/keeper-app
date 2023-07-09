import express from "express";
import session from "express-session";
import cors from "cors";
import 'dotenv/config'
import mongoose from "mongoose";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

const app = express();
const port = process.env.PORT || 8000;

//Middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }, //to change to true
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