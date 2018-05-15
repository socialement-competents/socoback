FROM node:8.11.1-alpine as build
WORKDIR /tmp/socoback
COPY . .
RUN yarn --pure-lockfile --non-interactive
RUN yarn build

FROM keymetrics/pm2:8-alpine
LABEL maintainer="Théophile Cousin <cousin.theophile@gmail.com>, Thomas Sauvajon <thomas.sauvajon.dev@gmail.com>"
ENV KEYMETRICS_PUBLIC=m1cgmqibbhlibom
ENV KEYMETRICS_SECRET=yl5lvcryikz8p9h
ENV SESSION_SECRET=tennisifyprod
WORKDIR /var/www

COPY package.json .
COPY yarn.lock .
RUN yarn --pure-lockfile --non-interactive --prod

COPY --from=build /tmp/socoback/build ./build
COPY process.yml .
EXPOSE 3000

CMD ["pm2-runtime", "--json", "process.yml", "--web", "--only", "webserver"]
