# Выбор базового образа
FROM node:14 AS build

# Создание директории приложения
WORKDIR /app

# Установка зависимостей приложения
COPY package*.json ./
RUN npm install

# Копирование исходного кода приложения
COPY . ./

# Сборка приложения
RUN npm run build

# Print the contents of the /app directory
RUN ls -la /app

# Использование образа Nginx для сервирования контента
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Открытие 80 порта для HTTP трафика
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]