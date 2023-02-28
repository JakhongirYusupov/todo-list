const form = document.querySelector(".todo-form");
const input = document.querySelector(".add-task");
const todoList = document.querySelector(".todo-list");

const createElement = (...arr) => {
  return arr.map((el) => document.createElement(el))
};

const putTodo = async (todoId, userId) => {
  let res = await fetch("http://localhost:5000/todos", {
    method: "PUT",
    body: JSON.stringify({
      todoId,
      userId
    })
  })

  let data = await res.json();
}

const pushTodos = (todos) => {
  todoList.innerHTML = ""

  if (todos.length) {
    todos.map((el) => {
      const [item, checker, span1, input, span2] = createElement("div", "div", "span", "input", "span");
      item.className = "todo-item";
      checker.className = "checker";
      input.type = "checkbox";
      span2.innerText = el.todo;
      span2.className = "ml-2";

      if (el.checked === true) input.checked = true

      input.addEventListener("change", () => putTodo(el.id, el.userId))

      span1.appendChild(input);
      checker.appendChild(span1);
      item.appendChild(checker);
      item.appendChild(span2);
      todoList.prepend(item)
      return
    })
  } else todoList.innerHTML = `<h3>404 Not Found</h3>`

};

; (async function () {
  let token = JSON.parse(window.localStorage.getItem("todo_token"));
  if (token) {
    let res = await fetch("http://localhost:5000/token-verify", {
      method: "POST",
      body: JSON.stringify({ token })
    });
    let data = await res.json();
    if (data.status !== 200) return window.location = "/login";

    let todos = await fetch("http://localhost:5000/user-todos", {
      method: "POST",
      body: JSON.stringify({
        token,
        type: "all"
      })
    })

    let usertodos = await todos.json();

    pushTodos(usertodos.todos)
    return
  }
  return window.location = "/login"
}())


form.addEventListener("submit", async () => {
  let token = JSON.parse(window.localStorage.getItem("todo_token"));
  const data = {
    "todo": input.value,
    token
  };
  if (token) {
    const res = await fetch("http://localhost:5000/todos", {
      method: "POST",
      body: JSON.stringify(data)
    });
    form.reset();
    let todo = await res.json();
    if (todo.status === 200) {
      if (token) {
        let todos = await fetch("http://localhost:5000/user-todos", {
          method: "POST",
          body: JSON.stringify({
            token,
            type: "all"
          })
        })
        let usertodos = await todos.json();
        pushTodos(usertodos.todos)
        return
      }
      return window.location = "/login"
    }
  } else window.location = "/login"
})

all.addEventListener("click", async () => {
  let token = JSON.parse(window.localStorage.getItem("todo_token"));
  if (token) {
    let todos = await fetch("http://localhost:5000/user-todos", {
      method: "POST",
      body: JSON.stringify({
        token,
        type: "all"
      })
    })

    let usertodos = await todos.json();

    pushTodos(usertodos.todos)
    return
  }
  return window.location = "/login"
});
active.addEventListener("click", async () => {
  let token = JSON.parse(window.localStorage.getItem("todo_token"));
  if (token) {
    let todos = await fetch("http://localhost:5000/user-todos", {
      method: "POST",
      body: JSON.stringify({
        token,
        type: "active"
      })
    })

    let usertodos = await todos.json();
    pushTodos(usertodos.todos)
    return
  }
  return window.location = "/login"
});
complated.addEventListener("click", async () => {
  let token = JSON.parse(window.localStorage.getItem("todo_token"));
  if (token) {
    let todos = await fetch("http://localhost:5000/user-todos", {
      method: "POST",
      body: JSON.stringify({
        token,
        type: "complated"
      })
    })

    let usertodos = await todos.json();
    pushTodos(usertodos.todos)
    return
  }
  return window.location = "/login"
});