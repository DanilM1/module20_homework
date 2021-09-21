/* import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import { User } from "./models/User";
import { generateTestUser } from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";

export const appState = new State();

const loginForm = document.querySelector("#app-login-form");

generateTestUser(User);

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  let fieldHTMLContent = authUser(login, password)
    ? taskFieldTemplate
    : noAccessTemplate;

  document.querySelector("#content").innerHTML = fieldHTMLContent;
}); */

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import { User } from "./userClass";
import * as component from "./templates/components";
import * as contentHTML from "./templates/content";
import { tagName } from "./templates/tagName";

const content = document.getElementById(tagName.content);

let login = "", user = "", buf = "", arr = "", textarea = "", d = "", all = "", block_ = "", t = "";


// events

document.addEventListener("click", function (e) {

  // registration

  if (e.target.innerHTML === contentHTML.content.registration) {
    login = document.querySelector("#login").value;
    if (login === "" || login === "admin" || localStorage[login]) alert("Sorry, this login is already using");
    else {
      user = new User(document.querySelector("#password").value, contentHTML.images.photo[Math.floor(Math.random() * contentHTML.images.photo.length)]);
      localStorage[login] = JSON.stringify(user);
      alert(`Hello, ${login}`);
      createMenu(login, user);
      userTasks(login, login, user);
      countTasks(0, 0);
    }
  }

  // enter

  if (e.target.innerHTML === contentHTML.content.signIn) {
    login = document.querySelector("#login").value;
    if (!localStorage[login] && login !== "admin") alert("Sorry, this login not found.");
    else {
      if (login === "admin" && document.querySelector("#password").value === "123") {
        alert(`Hello, ${login}`);
        createMenu(login);

        for (let [key, value] of Object.entries(localStorage)) {
          content.appendChild(component.taskList(login, key, JSON.parse(value)));
       }

        content.after(component.trash());

        document.querySelector("#trash").after(component.footer(login)); 
      }
      else {
        user = JSON.parse(localStorage[login]);
        if (document.querySelector("#password").value === user.password) {
          alert(`Hello, ${login}`);
          createMenu(login, user);
          userTasks(login, login, user);
          countTasks(user['tasks']['in_progress'].length, user['tasks']["finished"].length);
        }
        else alert("Sorry, this password is wrong.");
      }
    }
  }

  // show menu

  if (e.target.id === tagName.menu) {
    buf = component.menu();
    document.querySelector("nav").after(buf);
    e.target.parentNode.className = tagName["btn-group-dropup"];
    e.target.addEventListener("blur", function () {
      if (document.querySelector("." + tagName.listGroup)) document.querySelector("." + tagName.listGroup).remove();
      document.getElementById(tagName.menu).parentNode.className = tagName["btn-group-dropdown"];
    });
  }

  // create task

  if (e.target.innerHTML === contentHTML.content.createTask && !document.querySelector("textarea")) {
    textarea = document.createElement("textarea");
    e.target.before(textarea);
    e.target.parentNode.id = tagName.p;
    e.target.remove();

    textarea.addEventListener("blur", function () {
      d = document.getElementById(tagName.p);
      if (textarea.value !== "") {
        buf = document.createElement("p");
        buf.className = tagName.classStylesOfP;
        buf.draggable = true;
        buf.innerHTML = textarea.value;
        d.appendChild(buf);

        block_ = d.dataset.block;
        t = d.dataset.user;
        buf = JSON.parse(localStorage[t]);
        buf['tasks'][block_].push(textarea.value);
        localStorage[t] = JSON.stringify(buf);
        console.log(buf);
      }
      textarea.remove();
      d.appendChild(component.buttonCreateTask());
      d.removeAttribute('id');
    });
  }

  // change task

  if (e.target.draggable === true && !document.querySelector("textarea")) {
    textarea = document.createElement("textarea");
    e.target.after(textarea);
    e.target.id = tagName.p;
    all = e.target.innerHTML;
    e.target.parentNode.id = login + "_";
    textarea.addEventListener("blur", function () {
      if (textarea.value !== "") {
        d = document.getElementById(login + "_");
        block_ = d.dataset.block;
        t = d.dataset.user;
        buf = JSON.parse(localStorage[t]);
        arr = buf['tasks'][block_];
        for (var p in arr) {
          if (arr[p] === all) {
            arr[p] = textarea.value;
            break;
          }
        }
        buf['tasks'][block_] = arr;
        localStorage[t] = JSON.stringify(buf);
        d.removeAttribute('id');
        arr = document.getElementById(tagName.p);
        arr.innerHTML = textarea.value;
      }
      arr.removeAttribute('id');
      textarea.remove();
    });
  }
});

// Delete user

document.addEventListener("dblclick", function (e) {
  if (e.target.className === contentHTML.content.user) {
    localStorage.removeItem(e.target.innerHTML);
    e.target.parentNode.remove();
  }
});

// drag&drop

var dragged;

document.addEventListener("dragstart", function (e) {
  dragged = e.target;
});

document.addEventListener("dragover", function (e) {
  e.preventDefault();
});

document.addEventListener("drop", function (e) {
  if (dragged.parentNode.className == tagName.classStylesOfDiv) {
    dragged.parentNode.id = tagName.p;
    d = document.getElementById(tagName.p)
    block_ = d.dataset.block;
    t = d.dataset.user;
    buf = JSON.parse(localStorage[t]);
    arr = buf['tasks'][block_];
    all = [];
    for (var p in arr) {
      if (arr[p] !== dragged.innerHTML) all.push(arr[p]);
    }
    buf['tasks'][block_] = all;
    localStorage[t] = JSON.stringify(buf);
    dragged.parentNode.removeAttribute("id");
  }

  if (e.target.className == tagName.classStylesOfDiv) {
    e.target.id = tagName.p;
    d = document.getElementById(tagName.p)
    block_ = d.dataset.block;
    t = d.dataset.user;
    buf = JSON.parse(localStorage[t]);
    buf['tasks'][block_].push(dragged.innerHTML);
    localStorage[t] = JSON.stringify(buf);
    e.target.removeAttribute("id");
    e.preventDefault();
    dragged.parentNode.removeChild(dragged);
    e.target.appendChild(dragged);
  }

  if (e.target.id === contentHTML.content.trash) {
    e.preventDefault();
    dragged.parentNode.removeChild(dragged);
  }

  if (login !== "admin") {
    buf = JSON.parse(localStorage[login]);
    countTasks(buf['tasks']['in_progress'].length, buf['tasks']['finished'].length);
  }
});

function createMenu(l, u) {
  document.querySelector("form").remove();
  document.getElementById(tagName.navbarSupportedContent).after(component.buttonUser(l, u));
}

function userTasks(l, log, u) {
  buf = component.taskList(l, log, u);
  content.appendChild(buf);
      
  buf = component.trash();
  content.after(buf);
      
  buf = component.footer(l);
  document.querySelector("#trash").after(buf);      
}

function countTasks(a, b) {
  document.querySelector("." + tagName.countTasksInProgres).innerHTML = a;
  document.querySelector("." + tagName.countTasksFinished).innerHTML = b;
}