export async function loginUser(api, auth) {
  const res = await api
    .post("/api/users/login")
    .send({
      username: "testuser",
      password: "Test123",
    })
    .expect(200);

  auth.token = res.body.token;
  return;
}

export const initialScores = [
  { score: 503, username: "test" },
  { score: 400, username: "user" },
];

export const initialUsers = [
  {
    _id: "65f86eec7ddf10dd35cbe4a7",
    username: "testuser",
    passwordHash:
      "$2b$10$x8mjduAjXhOx/iuStqZVe.LGbK2psR0hK1eL6xyELVvfAdWO6/FXa",
  },
  {
    _id: "65f86eec7ddf10dd35cbe4a5",
    username: "willfail",
    passwordHash:
      "$2b$10$x8mjduAjXhOx/iuStqZVe.LGbK2psR0hK1eL6xyELVvfAdWO6/FXa",
  },
];
