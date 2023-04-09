const buttonElement = document.getElementById("button-form");
const inputNameElement = document.getElementById("input-name");
const textareaElement = document.getElementById("textarea-form");
const commentListElement = document.getElementById("comment-list");

let comments = [];

const fetchPromise = fetch(
    "https://webdev-hw-api.vercel.app/api/v1/dianova-arina/comments",
    {
        method: "GET",
    }
);
fetchPromise.then((response) => {
    const locale = "ru-RU";
    let todayData = { day: "numeric", month: "numeric", year: "2-digit" };
    let todayTime = { hour: "numeric", minute: "2-digit" };
    let userDate = new Date();

    response.json().then((responseData) => {
        comments = responseData.comments.map((comment) => {
            return {
                name: comment?.author?.name,
                date: `${userDate.toLocaleDateString(
                    locale,
                    todayData
                )} ${userDate.toLocaleTimeString(locale, todayTime)}`,
                text: comment.text,
                likes: comment.likes,
                isLiked: false,
            };
        });

        renderComments();
    });
});

const renderComments = () => {
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
     </div>
   </li>`;
        })
        .join("");

    commentListElement.innerHTML = commentsHtml;
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
    }
    answerEvent();
};
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
buttonElement.addEventListener("click", () => {
    inputNameElement.classList.remove("error");
    textareaElement.classList.remove("error");
    return;
}

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
}).then(() => {
    const fetchPromise = fetch(
        "https://webdev-hw-api.vercel.app/api/v1/dianova-arina/comments",
        {
            method: "GET",
        }
    );
    fetchPromise.then((response) => {
        const locale = "ru-RU";
        let todayData = { day: "numeric", month: "numeric", year: "2-digit" };
        let todayTime = { hour: "numeric", minute: "2-digit" };
        let userDate = new Date();

        response.json().then((responseData) => {
            comments = responseData.comments.map((comment) => {
                return {
                    name: comment?.author?.name,
                    date: `${userDate.toLocaleDateString(
                        locale,
                        todayData
                    )} ${userDate.toLocaleTimeString(locale, todayTime)}`,
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: false,
                };
            });

            renderComments();
        });
    });

    inputNameElement.value = "";
    textareaElement.value = "";
});
