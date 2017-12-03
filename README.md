# chaingear-golos-bot
Бот для отслеживания постов по тегам ico-data, cyberanalytics. Отбирает посты, написанные в markdown и загружает их в [репозиторий](https://github.com/goloschaingear/chaingear)

## Установка и запуск
1. npm install
2. Заполнить config.json:
..* `account`: имя аккаунта, который будет голосовать и комментировать посты
..* `wif`: постинг-ключ аккаунта
..* `git_key`: пароль от гитхаб-аккаунта golos-chaingear
..* `git_key1`: пароль от аккаунта, делающего коммиты в chaingear
..* `commit_webhook_secret`: пароль для webhook с push event
..* `owner`: cyberFund
..* `repo`: chaingear
3. Настроить webhooks в репозитории chaingear:
..* commit_webhook: Payload URL - `http://<домен>/commit`, Content type - `application/json`, `secret` - должен совпадать с `commit_webhook_secret` в `config.json`, `event` - `push`
