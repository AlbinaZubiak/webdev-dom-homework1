const buttonElement = document.getElementById("button-form");
const inputNameElement = document.getElementById("input-name");
const textareaElement = document.getElementById("textarea-form");
const commentListElement = document.getElementById("comment-list");
// const addCommText = document.getElementById('addComments');
// const addCommElement = document.getElementById('add-comm-text')

let comments = [];

const fetchAndRender = () => {
    return fetch(
        "https://webdev-hw-api.vercel.app/api/v1/dianova-arina/comments",
        {
            method: "GET",
        }
    )
        .then((response) => response.json())
        .then((responseData) => {
            const locale = "ru-RU";
            let todayData = { day: "numeric", month: "numeric", year: "2-digit" };
            let todayTime = { hour: "numeric", minute: "2-digit" };
            let userDate = new Date();
            comments = responseData.comments.map((comment) => {
                return {
                    name: comment?.author?.name,
                    date: `${userDate.toLocaleDateString(locale, todayData)} ${userDate.toLocaleTimeString(locale, todayTime)}`,
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: false,
                };
            });
            renderComments();
        });
};
fetchAndRender();

const renderComments = () => {
    const commentsHtml = comments.map((comment, index) => {
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

    commentListElement.innerHTML = commentsHtml;

    // лайки
    const likeButtonElements = document.querySelectorAll(".like-button");

    for (const likeButtonElement of likeButtonElements) {
        likeButtonElement.addEventListener("click", () => {
            const index = likeButtonElement.dataset.index;
            if (comments[index].isLiked === false) {
                comments[index].paint = "-active-like";
                comments[index].likes += 1;
                comments[index].isLiked = true;
            } else {
                comments[index].paint = "";
                comments[index].likes -= 1;
                comments[index].isLiked = false;
            }
            renderComments();
        });
        answerEvent();
    }
};

// ответ на комментарии при клике
const answerEvent = () => {
    const answerCommElements = document.querySelectorAll(".comment-text");
    for (const answerCommElement of answerCommElements) {
        answerCommElement.addEventListener("click", () => {
            const index = answerCommElement.dataset.index;
            textareaElement.value = `> ${comments[index].text} \n${comments[index].name}`;
        });
    }
};
renderComments();

// красный цвет при пустом поле ввода
// buttonElement.addEventListener("click", () => {
//   inputNameElement.classList.remove("error");
//   textareaElement.classList.remove("error");
//   if (inputNameElement.value === "" || textareaElement.value === "") {
//     inputNameElement.classList.add("error");
//     textareaElement.classList.add("error");
//     return;
//   }
// });

//

const newComment = () => {
    const locale = "ru-RU";
    let todayData = { day: "numeric", month: "numeric", year: "2-digit" };
    let todayTime = { hour: "numeric", minute: "2-digit" };
    let userDate = new Date();

    fetch("https://webdev-hw-api.vercel.app/api/v1/dianova-arina/comments", {
        method: "POST",
        body: JSON.stringify({
            name: inputNameElement.value,
            text: textareaElement.value,
            date: `${userDate.toLocaleDateString(
                locale,
                todayData
            )} ${userDate.toLocaleTimeString(locale, todayTime)}`,
            likes: 0,
            isLiked: false,
        }),
    })
        .then((response) => {
            if (response.status === 500) {
                return Promise.reject(new Error("Ошибка ответа сервера"));
            } else if (response.status === 400) {
                return Promise.reject(new Error("Неправильный ввод"));
            } else {
                return fetchAndRender();
            }
        })
        .then(() => {
            buttonElement.disabled = false;
            //buttonElement.textContent = "Написать";
            inputNameElement.value = "";
            textareaElement.value = "";
        })
        .catch((error) => {
            console.log(error)
            buttonElement.disabled = false;
            if (error.message === "Ошибка ответа сервера") {
                return newComment();
            }
            if (error.message === "Неправильный ввод") {
                alert("Имя и комментарий должны быть не короче 3 символов");
            } else {
                alert("Нет подкючения к сети, попробуйте позже");
            }
        });
};

buttonElement.addEventListener("click", newComment);
