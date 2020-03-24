FROM node:10.15.1
RUN mkdir -p /usr/src/handhsakeBackEnd
WORKDIR /usr/src/handhsakeBackEnd
COPY . .
RUN npm install
EXPOSE 3001
CMD [ "node", "index" ]