import { comments } from "./API.js";
import { initEventListeners } from "./index.js";

export const renderComments = () => {
    const commentListElement = document.getElementById("comment-list");
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
    initEventListeners();
};