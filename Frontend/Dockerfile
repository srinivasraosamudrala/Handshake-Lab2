FROM node:10.15.1
RUN mkdir -p /usr/src/handhsakeFrontEnd
WORKDIR /usr/src/handhsakeFrontEnd
COPY . .
RUN npm install
EXPOSE 3005
CMD [ "npm", "start" ]