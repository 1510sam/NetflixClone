const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Movies = require("../models/Movies");
const verify = require("../verifyToken");

router.post("/create", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovies = new Movies(req.body);
    try {
      const savedMovies = await newMovies.save();
      res.status(201).json(savedMovies);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovies = await Movies.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedMovies);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed");
  }
});

router.delete("/delete/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("The movie has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed");
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    const movies = await Movies.findById(req.params.id);
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/random", verify, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movies.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movies.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const movies = await Movies.find();
      res.status(200).json(movies.reverse());
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

module.exports = router;
