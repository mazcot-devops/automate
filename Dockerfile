FROM node:14 AS build

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install robotframework robotframework-requests

RUN apt-get install -y gnupg2 && \
    gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69 && \
    echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | tee /etc/apt/sources.list.d/k6.list && \
    apt-get update && \
    apt-get install -y k6

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/ ./backend/

COPY automate-test/ ./automate-test/

EXPOSE 3000

CMD ["node", "backend/app.js"]

