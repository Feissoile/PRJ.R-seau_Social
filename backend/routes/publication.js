var express = require("express");
var router = express.Router();

require("../models/connection");

const Publication = require("../models/publication");
const Comment = require("../models/comment");
const { checkBody } = require("../modules/checkBody");

//route pour la creation d'une publication
router.post("/publication/post", (req, res) => {
  console.log("newpost route");
  console.log(req.body);

  if (!checkBody(req.body, ["texte", "picture", "video"])) {
    res.json({ result: false, error: "Aucune élèment présent" });
    return;
  }

  const newPost = new Publication({
    userId: req.body.userId,
    profilPicture: req.body.profilPicture,
    nickname: req.body.nickname,
    texte: req.body.texte,
    picture: req.body.picture,
    video: req.body.video,
    date: req.body.date,
    likes: [],
  });

  newPost
    .save()
    .then((data) => {
      res.json({ result: true, post: data });
    })
    .catch((error) => {
      console.error("Erreur lors de l'enregistrement de la publication", error);
      res.json({ result: false, error: "Erreur" });
    });
});

//commentaire lié au post

router.post("/publication/:postId/comment", (req, res) => {
  if (!checkBody(req.body, ["texte", "picture", "video"])) {
    res.json({ result: false, error: "Aucune élèment présent" });
    return;
  }
  const newComment = new Comment({
    postId: req.params.postId,
    userId: req.body.userId,
    likes: [],
    texte: req.body.texte,
    picture: req.body.picture,
    video: req.body.video,
    date: req.body.date,
  });

  newComment.save()
    .then((data) => {
      res.json({ result: true, comment: data });
    })
    .catch((error) => {
      console.error("Erreur lors de l'enregistrement du commentaire", error);
      res.json({ result: false, error: "Erreur lors de l'ajout du commentaire" });
    });
});


//Route pour gérer les likes des publications

router.post("/publication/:postId/like", (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;

 
  Publication.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ result: false, error: "Post introuvable" });
      }

      const alreadyLiked = post.likes.includes(userId);

      if (alreadyLiked) {
       
        post.likes = post.likes.filter(id => id.toString() !== userId);
      } else {
       
        post.likes.push(userId);
      }

      post.save()
        .then(updatedPost => res.json({ result: true, likes: updatedPost.likes }))
        .catch(error => res.status(500).json({ result: false, error }));
    })
    .catch(error => res.status(500).json({ result: false, error: "Erreur lors de la requête du like" }));
});