
---

### Сборка и разработка фронтендов

Для сборки и разработки используется локальный сервер webpack. Логика сборки и запуска изолирована в каталоге layout и не осуществляется при сборке docker контейнеров, не участвует в логике доставки/развертывания CI/CD. 

Команда `npm run build:{project}` копирует каталог layout/{project}/dist/assets в соответствующий каталог проекта app/public/{project}/assets удаляя (очищая полностью) предварительно оба.

```
layout/{project}/dist/assets => проекта app/public/{project}/assets
```

##### Команды запуска Webpack сервера разработки:

```
npm run start:provider
npm run start:client
npm run start:admin
```

##### Команды запуска сборки фронтенда:

```
npm run build:provider
npm run build:client
npm run build:admin
```
