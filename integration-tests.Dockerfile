FROM node:8.11.1-alpine
LABEL maintainer="Théophile Cousin <cousin.theophile@gmail.com>"

RUN mkdir -p /tmp/app

COPY . /tmp/app

WORKDIR /tmp/app

ENV SESSION_SECRET=secret
ENV JEST_JUNIT_OUTPUT=reports/junit/js-test-results.xml

RUN yarn --frozen-lockfile --non-interactive

EXPOSE 3000