const form = document.querySelector(".todo-form");
const input = document.querySelector(".add-task");

form.addEventListener("submit", async () => {
  const data = {
    "id": 1,
    "todo": input.value
  }
  const res = await fetch("http://localhost:8000/user/1", {
    method: "POST",
    body: JSON.stringify(data)
  })
  console.log(res);

})