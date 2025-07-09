# Проектная работа Mesto

https://github.com/StanislavBabich/mesto-project-ff

https://stanislavbabich.github.io/mesto-project-ff

Станислав. Доброго времени суток. Спасибо большое за ревью. Внес правки в проэкт с учетом Ваших коментариев к нему.

А именно:

API.JS

1. Проблема двойного вызова res.json() устранена.
2. Обработка ошибок вынесена в checkResponse.

CARD.JS

3. Переменная cardTemplate объявлена в начале модуля, а не внутри функции.

INDEX.JS

4. validationConfig объявлена в index.js и передается в функции валидации.
5. Дал более явное название переменной popupCaption теперь она popupcaptionImage.
6. Везде добавлены .catch для промисов API.
7. Используется evt.submiter для получения кнопки сабмита.
8. Добавлена утилита renderLoading для управление состоянием кнопок.
9. Вызов clearValidation теперь не дублирует toggleButtonState, а toggleButtonState вызывается отдельно.
10. Закрытие форм происходит только после успешного ответа сервера.

VALIDATION.JS

11. Используется передача congig в функции.
12. Используется setCustomValidity для установки кастомных сообщений.
13. Убрана жёсткая привязка к ID, вместо этого используется input.name и универсальные проверки.
14. Используется встроенная валидация браузера (input.validity, input.validationMessage).
15. clearValidation теперь вызывает toggleButtonState вместо прямого изменения кнопки.