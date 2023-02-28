const http = require("http");
const fs = require("fs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 8000;
const key = process.env.PRIVATE_KEY;

const { readFile, writeFile } = require("./utils/index.js");

const app = http.createServer((req, res) => {
  const todos = readFile("todos.json");
  const users = readFile("users.json");

  if (req.method === "GET") {
    if (req.url === "/") {
      return res.end(fs.readFileSync("./client/home/index.html"))
    };
    if (req.url === "/main.js") return res.end(fs.readFileSync("./client/home/main.js"));

    if (req.url === "/register") return res.end(fs.readFileSync("./client/register/index.html"));
    if (req.url === "/register.js") return res.end(fs.readFileSync("./client/register/register.js"));

    if (req.url === "/login") return res.end(fs.readFileSync("./client/login/index.html"));
    if (req.url === "/login.js") return res.end(fs.readFileSync("./client/login/login.js"));
  }

  if (req.method === "POST") {
    if (req.url === "/token-verify") {
      try {
        req.on("data", chunk => {
          const token = JSON.parse(chunk);
          const { id, username, email } = jwt.verify(token.token, key);
          const foundUser = users.find((el) => el.id === id && el.username === username && el.email === email);
          if (foundUser) {
            return res.end(JSON.stringify({ "status": 200, message: "user active" }))
          } else return res.end(JSON.stringify({ "status": 404, message: "user not found" }))
        })
      } catch (error) {
        res.write(error);
      }
    }
    if (req.url === "/todos") {
      try {
        req.on("data", chunk => {
          const { todo, token } = JSON.parse(chunk);
          if (todo.length && typeof todo === "string" && token) {
            const { id, username, email } = jwt.verify(token, key);
            const foundUser = users.find((el) => el.id === id && el.username === username && el.email === email);
            if (!foundUser) return res.end(JSON.stringify({ "status": 400, "message": "User not found" }))
            const userTodo = {
              id: todos[todos.length - 1]?.id + 1 || 1,
              todo,
              checked: false,
              userId: id
            }
            todos.push(userTodo);
            writeFile("todos.json", todos);
            return res.end(JSON.stringify({ "status": 200, "message": "okay" }))
          } else return res.end({ "status": 400, "message": "todo empty" })
        })
      } catch (error) {
        console.log(error);
      }
    }

    if (req.url === "/register") {
      req.on("data", chunk => {
        const { username, email, password } = JSON.parse(chunk);
        const foundEmail = users.find((el) => el.email === email);
        if (foundEmail) return res.end(JSON.stringify({ status: 400, message: "This email already exist!" }));
        const user = {
          id: users[users.length - 1]?.id ? users[users.length - 1]?.id + 1 : 1,
          username,
          email,
          password
        };
        users.push(user);
        writeFile("users.json", users);
        delete user.password
        let token = jwt.sign(user, key, { expiresIn: "15d" });
        return res.end(JSON.stringify({
          status: 200,
          message: "Succes registered!",
          token
        }))
      })
    }

    if (req.url === "/login") {
      try {
        req.on("data", chunk => {
          const { email, password } = JSON.parse(chunk);
          const foundUser = users.find((el) => el.email === email && el.password === password);
          if (!foundUser) return res.end(JSON.stringify({ status: 400, message: "User not found!" }));
          delete foundUser.password
          let token = jwt.sign(foundUser, key, { expiresIn: "15d" });
          return res.end(JSON.stringify({
            status: 200,
            message: "Succes login!",
            token
          }))
        })
      } catch (error) {
        console.log(error);
      }
    }

    if (req.url === "/user-todos") {
      try {
        req.on("data", chunk => {
          const token = JSON.parse(chunk);
          const { id, username, email } = jwt.verify(token.token, key);
          const foundUser = users.find((el) => el.id === id && el.username === username && el.email === email);
          if (foundUser) {
            if (token.type === "all") {
              const userTodos = todos.filter((el) => el.userId === foundUser.id);
              return res.end(JSON.stringify({ "status": 200, message: "user active", todos: userTodos }))
            }
            if (token.type === "active") {
              const userTodos = todos.filter((el) => el.userId === foundUser.id && el.checked === false);
              return res.end(JSON.stringify({ "status": 200, message: "user active", todos: userTodos }))
            }
            if (token.type === "complated") {
              const userTodos = todos.filter((el) => el.userId === foundUser.id && el.checked === true);
              return res.end(JSON.stringify({ "status": 200, message: "user active", todos: userTodos }))
            }
          } else return res.end(JSON.stringify({ "status": 404, message: "user not found" }))
        })
      } catch (error) {
        res.write(error);
      }
    }
  }

  if (req.method === "PUT") {
    if (req.url === "/todos") {
      req.on("data", chunk => {
        let data = JSON.parse(chunk)
        if (typeof data.todoId === "number" && typeof data.userId === "number") {
          let todo = todos.find((el) => el.id === data.todoId && el.userId === data.userId);
          if (todo) {
            todos.forEach((el) => {
              if (el.id === todo.id) {
                el.checked = !el.checked
                writeFile("todos.json", todos)
                return res.end(JSON.stringify({ status: 200, message: "okay" }));
              }
            })
          }
          return res.end(JSON.stringify({ status: 404, message: "Todo not found" }));
        }
      })
    }
  }
});

app.listen(PORT, () => console.log(`Server is running http://localhost:${PORT}`));