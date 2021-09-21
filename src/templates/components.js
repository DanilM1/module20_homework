
import { tagName } from "./tagName";
import * as contentHTML from "./content";

export {buttonCreateTask};
export {buttonUser, menu, taskList, trash, footer};

let buf = "";

// menu

function buttonUser (login, user) {
    const buttonUser = creatButton(tagName.classButtonStyle, "");
    buttonUser.id = contentHTML.content.menu;
    buttonUser.className += tagName.p + tagName["dropdown-toggle"] + tagName.p + tagName.menu;
    buf = document.createElement("img");
    buf.id = tagName.userImg;
    if (login === "admin") buf.src = contentHTML.images.photo[Math.floor(Math.random() * contentHTML.images.photo.length)];
    else buf.src = user['image'];
    buf.draggable = false;
    buttonUser.appendChild(buf);
    buf = document.createElement("div");
    buf.className = tagName["btn-group-dropdown"];
    buf.appendChild(buttonUser);
    return buf;
}

function menu () {
    buf = document.createElement("ul");
    buf.className = tagName.listGroup;
    for (var item in contentHTML.menu) {
        const li = document.createElement("li");
        li.className = tagName.StylesListMenu + tagName.p + tagName.colorDark;
        li.innerHTML = contentHTML.menu[item];
        buf.appendChild(li);
    }
    return buf;
}

// Tasks

function buttonCreateTask () {
    const buttonCreateTask = creatButton(tagName.classButtonStyle, contentHTML.content.createTask);
    buttonCreateTask.className += tagName.p + tagName.colorDark;
    return buttonCreateTask;
}

function taskList (login, name, user) {
    let listTasks = document.createElement("div");
    listTasks.className = tagName.container;
    if (login !== name) {
        buf = document.createElement("h2");
        buf.innerHTML = name;
        buf.className = contentHTML.content.user;
        listTasks.appendChild(buf);
    }
    let unitListTasks = document.createElement("div");
    unitListTasks.className = tagName.unitListTasksStyle;
    for (var [unit, value] of contentHTML.unitTasks) {
        let unitName = document.createElement("div");
        unitName.className = tagName.classStylesOfDiv;
        unitName.dataset.user = name;
        unitName.dataset.block = unit;
        let h = document.createElement("h5");
        h.innerHTML = value;
        unitName.appendChild(h);
        for (var p in user['tasks'][unit]) {
            buf = document.createElement("p");
            buf.className = tagName.classStylesOfP;
            buf.draggable = true;
            buf.innerHTML = user['tasks'][unit][p];
            unitName.appendChild(buf);
        }
        if (unit === "backlog") unitName.appendChild(buttonCreateTask());
        unitListTasks.appendChild(unitName);
    }
    listTasks.appendChild(unitListTasks);
    buf = document.createElement("hr");
    listTasks.appendChild(buf);
    return listTasks;
}

// trash

function trash () {
    const img = document.createElement("img");
    img.id = contentHTML.content.trash;
    img.src = contentHTML.images.trash;
    img.alt = contentHTML.content.trash;
    return img;
}

// Footer

function footer (login) {
    const footer = document.createElement("footer");
    if (login !== "admin") {
        buf = document.createElement("p");
        buf.className = "mx-2";
        buf.innerHTML = contentHTML.content.countTasksInProgres;
        footer.appendChild(buf);
        buf = document.createElement("p");
        buf.className = "mx-2 " + tagName.countTasksInProgres;
        footer.appendChild(buf);
        buf = document.createElement("p");
        buf.className = "mx-2";
        buf.innerHTML = contentHTML.content.countTasksFinished;
        footer.appendChild(buf);
        buf = document.createElement("p");
        buf.className = "mx-2 " + tagName.countTasksFinished;
        footer.appendChild(buf);
    }
    else {
        buf = document.createElement("p");
        buf.innerHTML = contentHTML.content.deleteUser;
        footer.appendChild(buf);
    }
    return footer;
}

// no component

function creatButton (style, name) {
    const button = document.createElement("button");
    button.type = "submit";
    button.className = style;
    button.innerHTML = name;
    return button;
}