const express = require("express")
const router = new express.Router()
const ExpressError = require("../expressError")
const items = require("../fakeDb")

router.get("/", function (req, res) {
  res.json({ items })
})

router.post("/", function (req, res, next) {
  try {
    if (!req.body.name) throw new ExpressError("Name is required", 400);
    if (!req.body.price) throw new ExpressError("Price is required", 400);
    const newItem = { name: req.body.name, price:req.body.price };
    items.push(newItem)
    return res.status(201).json({ item: newItem })
  } catch (e) {
    return next(e)
  }
})

router.get("/:name", function (req, res) {
  const foundItem = items.find(item => item.name === req.params.name)
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404)
  }
  res.json({ item: foundItem })
})

// if name is price is blank respond with message saying need name and price?
router.patch("/:name", function (req, res) {
  const foundItem = items.find(item => item.name === req.params.name)
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404)
  }
  foundItem.name = req.body.name;
  foundItem.price = req.body.price;
  res.json({ item: foundItem })
})

router.delete("/:name", function (req, res) {
  const foundIndex = items.findIndex(item => item.name === req.params.name);
  if (foundIndex === -1) {
    throw new ExpressError("Item not found", 404);
  }
  items.splice(foundIndex, 1);
  res.json({ message: "Deleted" });
});


module.exports = router;