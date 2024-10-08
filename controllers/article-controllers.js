const {
  articleById,
  returnArticles,
  returnsArticlesComments,
  postNewComment,
  patchArticleById,
  postNewArticle,
  deleteArticleById,
} = require("../models/article-models");
const { getAllTopics } = require("../models/topic-models");
const { returnUsers } = require("../models/user-models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  returnsArticlesComments(article_id, 100)
    .then((comments) => {
      return comments.length;
    })
    .then((comment_count) => {
      return articleById(article_id, comment_count);
    })
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticleById(article_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, p, author } = req.query;

  getAllTopics()
    .then((topics) => {
      const foundTopic = topics.find((topicObj) => topicObj.slug === topic);
      if (topic === undefined) {
        return undefined;
      } else {
        if (foundTopic) {
          return foundTopic.slug;
        } else return Promise.reject({ status: 400, msg: "Bad request" });
      }
    })
    .then(() => {
      return returnUsers();
    })
    .then((users) => {
      const foundUser = users.find((userObj) => userObj.username === author);
      if (author === undefined) {
        return undefined;
      } else {
        if (foundUser) {
          return foundUser.username;
        } else return Promise.reject({ status: 400, msg: "Bad request" });
      }
    })
    .then(() => {
      return returnArticles(sort_by, order, topic, limit, p, author);
    })
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesComments = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;
  returnsArticlesComments(article_id, limit, p)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  postNewComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  articleById(article_id)
    .then(() => {
      return patchArticleById(article_id, inc_votes);
    })
    .then((article) => {
      res.status(201).send({ article });
    })

    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  postNewArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.handleInvalidMethod = (req, res) => {
  res.set("allow", "GET");
  res.status(405).send({ msg: "Method Not Allowed" });
};
