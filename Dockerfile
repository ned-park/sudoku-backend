FROM node:20-alpine as builder
ENV NODE_ENV production
WORKDIR /usr/src/app

COPY . .

RUN npm ci
RUN npm install -g @vercel/ncc
RUN ncc build index.js -o dist

#FROM node:20-alpine
#ENV NODE_ENV production
#WORKDIR /usr/src/app
#COPY --from=builder /usr/src/app/dist/index.js .

USER node
CMD ["node", "index.js"]
