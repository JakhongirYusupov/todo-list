const email = document.querySelector("#exampleInputEmail1");
const password = document.querySelector("#exampleInputPassword1");

; (async function () {
  let token = JSON.parse(window.localStorage.getItem("todo_token"));
  if (token) {
    let res = await fetch("http://localhost:5000/token-verify", {
      method: "POST",
      body: JSON.stringify({ token })
    });
    let data = await res.json();
    if (data.status === 200) return window.location = "/";
    return
  }
}())

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })

  const { status, message, token } = await res.json();
  if (status === 200 && token) {
    alert(message);
    window.location = "/"
    return window.localStorage.setItem("todo_token", JSON.stringify(token));
  } else {
    alert(message);
  }
})