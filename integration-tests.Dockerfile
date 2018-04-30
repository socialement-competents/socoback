FROM node:8.11.1-alpine

RUN mkdir -p /tmp/app

ADD . /tmp/app

WORKDIR /tmp/app

ENV SESSION_SECRET=secret
ENV JEST_JUNIT_OUTPUT=reports/junit/js-test-results.xml

RUN npm install --quiet

EXPOSE 3000