FROM node:16 AS test-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN CI=TRUE npm test

FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY --from=test-stage /usr/src/app/ /usr/src/app/

RUN npm ci

ENV REACT_APP_BACKEND_URL=http://localhost:3000

RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
