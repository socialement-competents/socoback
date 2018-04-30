FROM keymetrics/pm2:latest-alpine

RUN npm install pm2 -g

COPY package.json /var/www/
COPY process.yml /var/www/
COPY node_modules /var/www/node_modules
COPY build /var/www/build

WORKDIR /var/www

ENV KEYMETRICS_PUBLIC=m1cgmqibbhlibom
ENV KEYMETRICS_SECRET=yl5lvcryikz8p9h
ENV SESSION_SECRET=tennisifyprod

RUN npm install --production

EXPOSE 3000

CMD ["pm2-runtime", "--json", "process.yml", "--web", "--only", "webserver"]