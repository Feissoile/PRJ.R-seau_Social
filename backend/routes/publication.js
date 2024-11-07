var express = require("express");
var router = express.Router();

require("../models/connection");

const User = require("../models/user");
const Publication = require("../models/publication");
const Comment = require("../models/comment");
const { checkBody } = require("../modules/checkBody");

//route pour la creation d'une publication
router.post("/publication/post", (req, res) => {
  console.log("Route POST /publication/post appelée");
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

  newComment
    .save()
    .then((data) => {
      res.json({ result: true, comment: data });
    })
    .catch((error) => {
      console.error("Erreur lors de l'enregistrement du commentaire", error);
      res.json({
        result: false,
        error: "Erreur lors de l'ajout du commentaire",
      });
    });
});

//Route pour gérer les likes/unlikes des publications

router.post("/publication/:postId/like", (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;

  Publication.findById(postId)
    .then((post) => {
      if (!post) {
        return res
          .status(404)
          .json({ result: false, error: "Post introuvable" });
      }

      const alreadyLiked = post.likes.includes(userId);
      //logique pour unlike
      if (alreadyLiked) {
        post.likes = post.likes.filter((id) => id.toString() !== userId);
      } else {
        //logique pour like
        post.likes.push(userId);
      }

      post
        .save()
        .then((updatedPost) =>
          res.json({ result: true, likes: updatedPost.likes })
        )
        .catch((error) => res.status(500).json({ result: false, error }));
    })
    .catch((error) =>
      res
        .status(500)
        .json({ result: false, error: "Erreur lors de la requête du like" })
    );
});

//affichage des publications amis

router.get("/friendpost", async (req,res) => {
  const { userId } = req.body;
  try {

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "Utilisateur introuvable" });
    }
    const postFriends = await Publication.find().sort({ date: -1 }).limit(10);
    res.json({ sucess : true, data : postFriends})
  } catch (error) {
    res.status(500).json({ success: false, error: "erreur lors de la recuperation des posts amis" });
  }

});


module.exports = router;
