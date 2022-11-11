FROM node:lts as frontend
WORKDIR /frontend
COPY ./frontend ./

RUN yarn global add @quasar/cli
RUN yarn install 
RUN quasar build -m pwa


FROM node:lts
WORKDIR /app
COPY ./backend ./
COPY --from=frontend /frontend/dist/pwa/ ./src/public/ 

RUN yarn global add pm2
RUN yarn install


EXPOSE 3000
ENTRYPOINT ["pm2-runtime", "start", "ecosystem.config.js"]


