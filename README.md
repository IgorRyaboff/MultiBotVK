# MultiBotVK
Это приложение позволяет совместно работать различным чат-ботам ВКонтакте и при этом занимать один и тот же домен и работать на одном и том же порте.

# Инструкция по настройке
Для работы MultiBotVK потребуется Node.js (рекомендуется версия 12 или выше). Зависимостей за исключением стандартных пакетов нет.

После установки клонированием репозитория создайте папку `scripts`. Именно в ней будут располагаться ваши скрипты.

К адресу вашего сервера в настройках Callback API должно быть указано имя скрипта, который должен запускаться при вызове событий от этого сообщества. Например, для выбора скрипта `bot.js` адрес выглядит как-то так: `http://<адрес сервера>/bot`. Расширение `.js` не требуется

# Взаимодействие MultiBotVK и скрипта

Сервер запускает скрипт как функцию, передавая в качестве единственного аргумента объект, переданный сервером ВК и ожидая в качестве возвращаемого значения `Promise`. Пример скрипта:

```js
module.exports = data => new Promise(resolve => {
  if (data.type == 'confirmation')
  console.log('Hello world from community ' + data.group_id);
  resolve();
});
```

В качестве возвращаемых промисом данных должен выступать объект с приведённой ниже структурой:
```
{
  text : string (текст, возвращаемый серверу ВК, если не задано - "ok")
  code : number (HTTP-код ответа, возвращаемый серверу ВК, если не задан - 200)
}
```
Допускается вызов `resolve` без передачи какого-либо объекта, в этом случае будут использоваться значения возвращаемого текста и HTTP-кода ответа по умолчанию.