FROM node:18-bookworm-slim

RUN apt-get update

RUN groupadd -g 1010 appuser
RUN useradd -m -u 2001 -g appuser appuser

WORKDIR home/appuser/code/

COPY package*.json .

RUN npm install
# RUN chmod -R 777 /home/appuser/code/
