FROM node:14 AS build

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install robotframework robotframework-requests

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/ ./backend/

COPY automate-test/ ./automate-test/

EXPOSE 3000

CMD ["node", "backend/app.js"]

