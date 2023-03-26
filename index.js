const buttonElement = document.getElementById("button-form");
const inputNameElement = document.getElementById("input-name");
const textareaElement = document.getElementById("textarea-form");
const commentListElement = document.getElementById("comment-list");

const comments = [
    {
        name: "Глеб Фокин",
        text: "Это будет первый комментарий на этой странице",
        likes: 3,
        data: "12.02.22 12:18",
        paint: "",
        userLike: false,
    },
    {
        name: "Варвара Н.",
        text: "Мне нравится как оформлена эта страница! ❤",
        likes: 75,
        data: "13.02.22 19:22",
        paint: "-active-like",
        userLike: true,
    },
];


const renderComments = () => {
    const commentsHtml = comments.map((comment, index) => {
        return `<li class="comment">
    <div class="comment-header">
      <div>${comment.name}</div>
      <div>${comment.data}</div>
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
    }).join("");

    commentListElement.innerHTML = commentsHtml;

    const likeButtonElements = document.querySelectorAll(".like-button");

    for (const likeButtonElement of likeButtonElements) {
        likeButtonElement.addEventListener("click", () => {
            const index = likeButtonElement.dataset.index;
            if (comments[index].userLike === false) {
                comments[index].paint = "-active-like";
                comments[index].likes += 1;
                comments[index].userLike = true;
            } else {
                comments[index].paint = '';
                comments[index].likes -= 1;
                comments[index].userLike = false;
            }
            renderComments()
        });
    }
    answerEvent()
};

const answerEvent = () => {
    const answerCommElements = document.querySelectorAll(".comment-text");
    for (const answerCommElement of answerCommElements) {
        answerCommElement.addEventListener("click", () => {
            const index = answerCommElement.dataset.index;
            textareaElement.value = `> ${comments[index].text} \n${comments[index].name}`;
        })
    }
}
renderComments();

const locale = "ru-RU";
let todayData = { day: "numeric", month: "numeric", year: "2-digit" };
let todayTime = { hour: "numeric", minute: "2-digit" };
let date = new Date();

//
buttonElement.addEventListener("click", () => {
    inputNameElement.classList.remove("error");
    textareaElement.classList.remove("error");
    if (inputNameElement.value === "" || textareaElement.value === "") {
        inputNameElement.classList.add("error");
        textareaElement.classList.add("error");
        return;
    }

    comments.push({
        name: `${inputNameElement.value.replaceAll('<', '&lt').replaceAll('>', '&gt')}`,
        text: `${textareaElement.value.replaceAll('<', '&lt').replaceAll('>', '&gt')}`,
        data: `${date.toLocaleString(locale, todayData)} ${date.toLocaleTimeString(locale, todayTime)}`,
        likes: 0,
        paint: '',
        userLike: false
    });

    renderComments();

    inputNameElement.value = "";
    textareaElement.value = "";
});