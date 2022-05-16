FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
RUN yarn install
RUN yarn prisma generate
COPY . .
RUN yarn run build
EXPOSE 3001
CMD [ "node", "dist/main" ]