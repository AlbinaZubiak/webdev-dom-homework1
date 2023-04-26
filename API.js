const buttonElement = document.getElementById("button-form");
const inputNameElement = document.getElementById("input-name");
const textareaElement = document.getElementById("textarea-form");
const commentListElement = document.getElementById("comment-list");
// const addCommText = document.getElementById('addComments');
// const addCommElement = document.getElementById('add-comm-text')

import { renderComments } from "./render.js";

export let comments = [];

export const fetchAndRender = () => {
    return fetch(
        "https://webdev-hw-api.vercel.app/api/v1/zubiak-albina/comments",
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

export const newComment = () => {
    const locale = "ru-RU";
    let todayData = { day: "numeric", month: "numeric", year: "2-digit" };
    let todayTime = { hour: "numeric", minute: "2-digit" };
    let userDate = new Date();

    fetch("https://webdev-hw-api.vercel.app/api/v1/zubiak-albina/comments", {
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
                return Promise.reject(new Error("Сервер упал"));
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
            buttonElement.disabled = false;
            if (error.message === "Сервер упал") {
                return newComment();
            }
            if (error.message === "Неправильный ввод") {
                alert("Имя и комментарий должны быть не короче 3 символов");
            } else {
                alert("Кажется, у вас сломался интернет, попробуйте позже");
            }
        });
};