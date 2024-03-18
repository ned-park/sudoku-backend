import { test, after, beforeEach } from "node:test";
import assert, { strictEqual } from "node:assert";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../index.js";
import Score from "../models/Score.js";
import User from "../models/User.js";
import { loginUser, initialScores, initialUsers } from "./testutils.js";

const api = supertest(app);

beforeEach(async () => {
  await Score.deleteMany({});
  const scoreObjects = initialScores.map((score) => new Score(score));
  const scorePromises = scoreObjects.map((score) => score.save());
  await Promise.all(scorePromises);

  await User.deleteMany({});
  const userObjects = initialUsers.map((user) => new User(user));
  const userPromises = userObjects.map((user) => user.save());
  await Promise.all(userPromises);
});

test("GET: getHighScores", async () => {
  const response = await api
    .get("/api/score")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("POST: adding score works", async () => {
  const value = 300;
  await api
    .post("/api/score")
    .send({ score: value, username: "scorePostTest" })
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const res = await api.get("/api/score");
  assert.strictEqual(res.body.length, initialScores.length + 1);
  assert.strictEqual(
    res.body.some((document) => document.score == value),
    true
  );
});

test("POST: database will not add empty score", async () => {
  await api.post("/api/score").send({ username: "expectToFail" }).expect(422);
});

test("POST: Login", async () => {
  const res = await api
    .post("/api/users/login")
    .send({ username: "testuser", password: "Test123" })
    .expect(200)
    .expect("Content-Type", /json/);
  assert.strictEqual(res.body.user.username, "testuser");
  assert.notEqual(res.body.token, undefined);
});

var auth = {};
test("PUT: change username succeeds when logged in", async () => {
  await loginUser(api, auth);

  await api
    .put("/api/users/changeusername")
    .set("Authorization", "Bearer " + auth.token)
    .send({
      username: "testuser",
      password: "Test123",
      newUsername: "wontfail",
    })
    .expect(200);

  const res = await api
    .post("/api/users/login")
    .send({ username: "wontfail", password: "Test123" })
    .expect(200)
    .expect("Content-Type", /json/);
  assert.strictEqual(res.body.user.username, "wontfail");
  assert.notEqual(res.body.token, undefined);
});

test("PUT: change username fails when not unique and when not logged in", async () => {
  await loginUser(api, auth);

  await api
    .put("/api/users/changeusername")
    .set("Authorization", "Bearer " + auth.token)
    .send({
      username: "testuser",
      password: "Test123",
      newUsername: "willfail",
    })
    .expect(403);
});

test("PUT: change username fails when not logged in", async () => {
  await api
    .put("/api/users/changeusername")
    .send({
      username: "testuser",
      password: "Test123",
      newUsername: "willalsofail",
    })
    .expect(401);
});

test("POST: signup works with new user", async () => {
  const res = await api
    .post("/api/users/signup")
    .send({ username: "wontfail", password: "Test123" })
    .expect(201)
    .expect("Content-Type", /json/);

  assert.strictEqual(res.body.user.username, "wontfail");
  assert.notEqual(res.body.token, undefined);
});

test("POST: signup fails with duplicate username", async () => {
  await api
    .post("/api/users/signup")
    .send({ username: "willfail", password: "Test123" })
    .expect(422);
});

after(async () => {
  await mongoose.connection.close();
  process.exit(0);
});
