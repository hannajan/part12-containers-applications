FROM node:16 AS build-stage

WORKDIR /urs/src/app

COPY . .

RUN npm ci

ENV REACT_APP_BACKEND_URL=http://localhost:3000

RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build-stage /urs/src/app/build /usr/share/nginx/html
