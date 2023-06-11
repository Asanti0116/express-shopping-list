process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let widget = { name: "Widget", price: 25 };

beforeEach(function () {
  items.push(widget);
});

afterEach(function () {
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [widget] });
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${widget.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: widget });
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/unknownItem`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Creating an item", async () => {
    const res = await request(app).post("/items").send({ name: "Blue", price: 15 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ item: { name: "Blue", price: 15 } });
  });
  test("Responds with 400 if name or price is missing", async () => {
    const res = await request(app).post("/items").send({ name: "Blue" });
    expect(res.statusCode).toBe(400);
  });
});

describe("PATCH /items/:name", () => {
  test("Updating an item's name and price", async () => {
    const res = await request(app).patch(`/items/${widget.name}`).send({ name: "SuperWidget", price: 30 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: { name: "SuperWidget", price: 30 } });
  });
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).patch(`/items/UnknownWidget`).send({ name: "SuperWidget", price: 30 });
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", () => {
  test("Deleting an item", async () => {
    const res = await request(app).delete(`/items/${widget.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/x`);
    expect(res.statusCode).toBe(404);
  });
});