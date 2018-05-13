FROM node:8.11.1-alpine as build
LABEL maintainer="Théophile Cousin <cousin.theophile@gmail.com>, Thomas Sauvajon <thomas.sauvajon.dev@gmail.com>"
WORKDIR /tmp/backathon
COPY . .
RUN yarn
RUN yarn build

FROM keymetrics/pm2:8-alpine
WORKDIR /var/www

COPY --from=build /tmp/backathon/build ./build

ENV KEYMETRICS_PUBLIC=m1cgmqibbhlibom
ENV KEYMETRICS_SECRET=yl5lvcryikz8p9h
ENV SESSION_SECRET=tennisifyprod

EXPOSE 3000

CMD ["pm2-runtime", "--json", "process.yml", "--web", "--only", "webserver"]
