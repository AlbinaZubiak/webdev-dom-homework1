import { loginUser } from "./api.js";
import { regUser } from "./api.js";

export function renderLoginComponent({ appElement, setToken, nameForForm, fetchAndRender }) {
    let isLoginMode = true;

    const renderForm = () => {
        const appHtml = ` 
        <div class="login">
        <div class="login__content">
        <p class="login__title">${isLoginMode ? "Авторизация" : "Регистрация"
            }</p>
        <span class="login__logpas">Логин</span><input id="login-input" class="login__input" type="text">
        <br>
        <span class="login__logpas">Пароль</span><input id="password-input" class="login__input" type="password" >
        <br>
        ${isLoginMode
                ? ""
                : `<span class="login__logpas">Имя</span><input id="name-input" class="login__input" type="text" >`
            }
        <button id="login-button" class="btnlog">${isLoginMode ? "Войти" : "Зарегистрироваться"
            }</button>
        <button id="reg-button" class="btnreg">${isLoginMode ? "Перейти к регистрации" : "Перейти ко входу"
            }</button>
        </div>
    </div>`;

        appElement.innerHTML = appHtml;
        document.getElementById("login-button").addEventListener("click", () => {
            if (isLoginMode) {
                const login = document.getElementById("login-input").value;
                const password = document.getElementById("password-input").value;
                if (!login) {
                    alert("Введите логин");
                    return;
                }
                if (!password) {
                    alert("Введите пароль");
                }

                loginUser({
                    login: login,
                    password: password,
                })
                    .then((user) => {

                        setToken(`Bearer ${user.user.token}`);
                        fetchAndRender();
                    })
                    .catch((error) => {
                        alert(error.message);
                    });
            } else {
                const login = document.getElementById("login-input").value;
                const password = document.getElementById("password-input").value;
                const name = document.getElementById("name-input").value;
                if (!name) {
                    alert("Введите имя");
                    return;
                }
                if (!login) {
                    alert("Введите логин");
                    return;
                }

                if (!password) {
                    alert("Введите пароль");
                    return;
                }

                regUser({
                    login: login,
                    password: password,
                    name: name,
                })
                    .then((user) => {
                        nameForForm(user.user.name);
                        setToken(`Bearer ${user.user.token}`);
                        fetchTodosAndRender();
                    })
                    .catch((error) => {
                        alert(error.message);
                    });
            }
        });

        document.getElementById("reg-button").addEventListener("click", () => {
            isLoginMode = !isLoginMode;
            renderForm();
        });
    };
    renderForm();
}