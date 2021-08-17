FROM node:10.16.0-alpine
RUN apk --no-cache add git gcc g++ make python linux-headers udev
RUN npm install --global node-gyp
WORKDIR /workspace/
COPY package.json .
COPY package-lock.json .
RUN npm i 
RUN npm install serialport --build-from-source
COPY . .

ENTRYPOINT [ "npm", "run", "start" ] 