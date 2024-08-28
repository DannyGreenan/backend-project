const express = require("express");
const app = express();
const topicsRouter = require("./routers/topics-routers");
const apiRouter = require("./routers/api-router");
const getArticlesRouter = require("./routers/article-routers");

app.use(express.json());

app.use(apiRouter);

app.use(topicsRouter);

app.use(getArticlesRouter);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.status === 400) {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.msg === "Article not found") {
    res.status(404).send({ msg: "Article not found" });
  } else if (err.msg === "Comments not found") {
    res.status(404).send({ msg: "Comments not found" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Article not found" });
  } else if (err.code === "23502" || err.code === "23503") {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 406) {
    res.status(406).send({ msg: "Not Acceptable" });
  }
  next(err);
});

module.exports = app;
