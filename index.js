// const buttonElement = document.getElementById("button-form");
// const inputNameElement = document.getElementById("input-name");
// const textareaElement = document.getElementById("textarea-form");
// const commentListElement = document.getElementById("comment-list");

import { getComments, postComments } from "./API.js";
import { renderLoginComponent } from "./login-components.js";
//const blokID = document.getElementById("ppa")
//const forma = document.getElementById("forma")

let comments = [];
let token = "Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k";

token = null;



const fetchAndRender = () => {
    return getComments({ token }).then((responseData) => {
        const locale = "ru-RU";
        let todayData = { day: "numeric", month: "numeric", year: "2-digit" };
        let todayTime = { hour: "numeric", minute: "2-digit" };
        comments = responseData.comments.map((comment) => {
            let commentDate = new Date(comment.date);
            return {
                name: comment?.author?.name,
                date: `${commentDate.toLocaleDateString(
                    locale,
                    todayData
                )} ${commentDate.toLocaleTimeString(locale, todayTime)}`,
                text: comment.text,
                likes: comment.likes,
                isLiked: false,
            };
        });
        renderApp();
    });
};

function renderApp() {
    const appElement = document.getElementById("app");
    const commentsHtml = comments
        .map((comment, index) => {
            return `<li class="comment">
      <div class="comment-header">
        <div>${comment.name}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text" data-index='${index}'> ${comment.text}</div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button data-index='${index}' class="like-button ${comment.paint}" ></button>
        </div>
      </div>
    </li>`;
        })
        .join("");

    const appHtml = `<main class="container">
      <ul class="comments" id="comment-list">
    <!--список в JS-->     
    ${commentsHtml}   
      </ul>  
      <article class="add-form">
      <input
        id="input-name"
        type="text"
        class="add-form-name"
        placeholder="Введите ваше имя"/>
  <textarea
        id="textarea-form"
        type="textarea"
        class="add-form-text"
        placeholder="Введите ваш комментарий"
        rows="4"></textarea>
      <div class="add-form-row">
        <button class="add-form-button" id="button-form">Написать</button>
      </div>
    </article>
    </main>`;

    appElement.innerHTML = appHtml;

    if (!token) {
        renderLoginComponent({
            appElement, setToken: (newToken) => {
                token = newToken;
            }, fetchAndRender, //forma
        })
        return;
    }

    const buttonElement = document.getElementById("button-form");
    const inputNameElement = document.getElementById("input-name");
    const textareaElement = document.getElementById("textarea-form");

    const newComment = () => {
        const locale = "ru-RU";
        let todayData = { day: "numeric", month: "numeric", year: "2-digit" };
        let todayTime = { hour: "numeric", minute: "2-digit" };
        let userDate = new Date();

        postComments({
            token,
            name: inputNameElement.value,
            text: textareaElement.value,
            date: `${userDate.toLocaleDateString(locale, todayData)} ${userDate.toLocaleTimeString(locale, todayTime)}`,
        })
            .then((response) => {
                console.log(response) // vidim  ошибка в объекте
                if (response.status === 400) {
                    throw new Error("Неправильный ввод");
                    //  return Promise.reject(new Error("Неправильный ввод"));
                }
                if (response.status === 500) {
                    throw new Error("Сервер упал");
                }
                return fetchAndRender();
            }).then(() => {
                buttonElement.disabled = false;
                inputNameElement.value = "";
                textareaElement.value = "";
            })
            .catch((error) => {
                console.log(error.message)
                buttonElement.disabled = false;

                switch (error.message) {
                    case "Неправильный ввод":
                        alert("Имя и комментарий должны быть не короче 3 символов");
                        break;
                    case "Сервер упал":
                        alert("Сервер упал")
                        break;
                    default:
                        alert("Кажется, у вас сломался интернет, попробуйте позже");
                        break;
                }
                // if (error.message === "Сервер упал") {
                //     return newComment();
                // }
                // if (error.message === "Неправильный ввод") {
                //     alert("Имя и комментарий должны быть не короче 3 символов");
                // } else {
                //     alert("Кажется, у вас сломался интернет, попробуйте позже");
                // }
            });
    };
    buttonElement.addEventListener("click", newComment);
    initEventListeners();
};
renderApp();
//fetchAndRender();

// лайки
function initEventListeners() {
    const likeButtonElements = document.querySelectorAll(".like-button");

    for (const likeButtonElement of likeButtonElements) {
        const index = +likeButtonElement.dataset.index;
        likeButtonElement.addEventListener("click", () => {
            if (comments[index].isLiked === false) {
                comments[index].paint = "-active-like";
                comments[index].likes += 1;
                comments[index].isLiked = true;
            } else {
                comments[index].paint = "";
                comments[index].likes -= 1;
                comments[index].isLiked = false;
            }
            renderApp();
        });
    }
};
// fetchAndRender();
initEventListeners();