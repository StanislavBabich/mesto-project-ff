# Проектная работа Mesto

https://github.com/StanislavBabich/mesto-project-ff

Анна, доброго времени суток. Спасибо большое за обратную связь по проэкту. С учетом Ваших замечаний внес правки в код:

1. Удалил подключение CSS и JS в HTML.

2. В package.json удалил строчку "jquery": "^3.7.1".

3. В modal.js в функции открытия и закрытия попапа заменил прямое изменение стилей на управление классами.

4. Так же от себя добавлю. Заметил что попапы закрывались резко. Что очень странно учитывая что перед отправкой на ревью все проверил, но видимо тут глаз уже замылился и не увидел. Теперь все работает корректно.

4. В card.js в функцию создания новой карточки передал как параметр функцию открытия модального окна.

5. В той же функции убрал глобальную переменную.

6. В index.js вынес функции-обработчики для удобства повторного использования и улучшения читаемости.

7. Там же инпуты форм получили один раз в глобальной области для повышения производительности.