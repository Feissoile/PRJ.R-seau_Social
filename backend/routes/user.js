import express from "express";
const router = express.Router();

import "../models/connection.js";
import User from "../models/user.js";
import { checkBody } from "../modules/checkBody.js";
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
//import Publication from "../models/publication.js";

/*Route pour un nouvelle utilisateur*/

router.post("/user/signup", (req, res) => {
  console.log("signup route");
  console.log(req.body);
  if (!checkBody(req.body, ["nickname", "email", "password", "adress"])) {
    res.json({ result: false, error: "Un des champs est manquant ou vide" });
    return;
  }

  User.findOne({ nickname: { $regex: new RegExp(req.body.nickname, "i") } })
    .then((data) => {
      if (data === null) {
        const hash = bcrypt.hashSync(req.body.password, 10);

        const newUser = new User({
          nickname: req.body.nickname,
          email: req.body.email,
          description: req.body.description,
          password: hash,
          isLog: true,
          adress: req.body.adress,
          profilePicture: req.body.profilePicture,
          coverPicture: req.body.coverPicture,
          token: uid2(32),
        });

        newUser.save().then((data) => {
          console.log("back : ", data.profilePicture);
          res.json({ result: true, user: data });
        });
      } else {
        res.json({ result: false, error: "Utilisateur déjà existant" });
      }
    })
    .catch((error) => {
      console.error("Erreur:", error);
      res.json({ result: false, error: "Erreur" });
    });
});

//connexion
router.post("/user/signin", (req, res) => {
  try {
    if (!checkBody(req.body, ["email", "password"])) {
      res.json({ result: false, error: "Un des champs est manquant ou vide" });
      return;
    }

    User.findOne({ email: { $regex: new RegExp(req.body.email, "i") } })
      .then((data) => {
        console.log("data => ", data);
        console.log(
          "password resp => ",
          bcrypt.compareSync(req.body.password, data.password)
        );
        if (data && bcrypt.compareSync(req.body.password, data.password)) {
          res.json({ result: true, email: data.email, token: data.token });
        } else {
          res.json({
            result: false,
            error: "Utilisateur non trouvé ou mot de passe erroné",
          });
        }
      })
      .catch((error) => {
        console.error("Erreur de connexion:", error);
        res.json({ result: false, error: "Erreur de connexion" });
      });
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
});

//deconnexion
router.put("/user/logout", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.json({ result: false, error: "Token invalide" });
  }

  User.updateOne({ token: token }, { isLog: false })
    .then((result) => {
      if (result.modifiedCount > 0) {
        res.json({ result: true, message: "Déconnexion réussie" });
      } else {
        res.json({
          result: false,
          error: "Utilisateur non trouvé ou déjà déconnecté",
        });
      }
    })
    .catch((error) => {
      console.error("Erreur de déconnexion:", error);
      res.json({ result: false, error: "Erreur de déconnexion" });
    });
});

/* Gestion du compte utilisateur*/
router.put("/user/updateProfile/:token", (req, res) => {
  const {
    nickname,
    email,
    password,
    adress,
    description,
    coverPicture,
    profilePicture,
  } = req.body;
  const token = req.params.token;

  if (!token) {
    return res.json({ result: false, error: "Token invalide" });
  }

  //Construction da la maj
  const updateFields = {};
  if (nickname) updateFields.nickname = nickname;
  if (email) updateFields.email = email;
  if (adress) updateFields.adress = adress;
  if (description) updateFields.description = description;
  if (coverPicture) updateFields.coverPicture = coverPicture;
  if (profilePicture) updateFields.profilePicture = profilePicture;

  //maj
  User.findOneAndUpdate({ token: token }, { $set: updateFields })
    .then((updatedUser) => {
      if (updatedUser) {
        res.json({ result: true, data: updatedUser });
      } else {
        res.json({ result: false, error: "Utilisateur introuvable" });
      }
    })
    .catch((error) => {
      console.error("Erreur de mise à jour du profil:", error);
      res.json({ result: false, error: "Erreur de mise à jour du profil" });
    });
});

export default router;
