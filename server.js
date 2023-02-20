const http = require("http");
const fs = require("fs");
const PORT = process.env.PORT || 8000;

const { readFile, writeFile } = require("./utils/index.js");

const app = http.createServer((req, res) => {
  const todos = readFile("todos.json");
  if (req.method === "GET") {
    console.log(req.url);
    if (req.url === "/") return res.end(fs.readFileSync("./client/home/index.html"));
    if (req.url === "/main.js") return res.end(fs.readFileSync("./client/home/main.js"));

    if (req.url === "/register") return res.end(fs.readFileSync("./client/register/index.html"));
    if (req.url === "/register.js") return res.end(fs.readFileSync("./client/register/register.js"));

    if (req.url === "/login") return res.end(fs.readFileSync("./client/login/index.html"));
    if (req.url === "/login.js") return res.end(fs.readFileSync("./client/login/login.js"));
  }

  if (req.method === "POST") {
    if (req.url === "/user/1") {
      req.on("data", chunk => {
        const data = JSON.parse(chunk);
        if (data.todo.length && typeof data.todo === "string") {
          todos.push(data);
          writeFile("todos.json", todos);
          return res.end({ "status": 200, "message": "okay" })
        } else return res.end({ "status": 400, "message": "todo empty" })
      })
    }
  }
});

app.listen(PORT, () => console.log(`Server is running http://localhost:${PORT}`));