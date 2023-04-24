const buttonElement = document.getElementById("button-form");
const inputNameElement = document.getElementById("input-name");
const textareaElement = document.getElementById("textarea-form");
const commentListElement = document.getElementById("comment-list");
// const addCommText = document.getElementById('addComments');
// const addCommElement = document.getElementById('add-comm-text')

import { renderComments } from "./rend.js";
import { comments } from "./API";
import { fetchAndRender } from "./API";
import { newComment } from "./API";

fetchAndRender();

// лайки
export const initEventListeners = () => {
    const likeButtonElements = document.querySelectorAll(".like-button");

    for (const likeButtonElement of likeButtonElements) {
        const index = +(likeButtonElement.dataset.index);
        likeButtonElement.addEventListener("click", () => {
            if (comments[index].isLiked === false) {
                //comments[index].paint = "-active-like";
                comments[index].likes += 1;
                comments[index].isLiked = true;
            } else {
                //comments[index].paint = "";
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
initEventListeners();

buttonElement.addEventListener("click", newComment);