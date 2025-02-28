const express = require("express");
const bookmarks = express.Router();
const {
  getAllBookmarks,
  getBookmark,
  createBookmark,
  deleteBookmark,
  updateBookmark,
} = require("../queries/bookmarks");
const { checkName, checkBoolean, validateURL } = require("../validations/checkBookmarks.js");

//REVIEWS ROUTE
const reviewsController = require("./reviewsController.js");
bookmarks.use("/:bookmarkId/reviews", reviewsController);

// INDEX
bookmarks.get("/", async (req, res) => {
    const allBookmarks = await getAllBookmarks();
    console.log(allBookmarks)
    if (allBookmarks[0]) {
      res.status(200).json(allBookmarks);
    } else {p
      res.status(500).json({ error: "server error" });
    }
});

// SHOW
bookmarks.get("/:id", async (req, res) => {
  const { id } = req.params;
  const bookmark = await getBookmark(id);
  if (bookmark) {
    res.json(bookmark);
  } else {
    res.status(404).json({ error: "not found" });
  }
});

// CREATE
bookmarks.post("/", checkBoolean, checkName, validateURL, async (req, res) => {
  try {
    const bookmark = await createBookmark(req.body);
    res.json(bookmark);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// DELETE
bookmarks.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedBookmark = await deleteBookmark(id);
  if (deletedBookmark.id) {
    console.log("working")
    res.status(200).json(deletedBookmark);
  } else {
    res.status(404).json("Bookmark not found");
  }
});

// UPDATE
bookmarks.put("/:id", validateURL, checkName, checkBoolean,  async (req, res) => {
  const { id } = req.params;
  const updatedBookmark = await updateBookmark(id, req.body);
  res.status(200).json(updatedBookmark);
});

module.exports = bookmarks;