FROM mhart/alpine-node:8.11.4 as base
WORKDIR /usr/src
COPY package.json yarn.lock /usr/src/
RUN apk add --no-cache --virtual .build-deps bash alpine-sdk python \
 && yarn install --silent \
 && apk del .build-deps
COPY . .
RUN yarn build
RUN rm -rf node_modules

FROM mhart/alpine-node:8.11.4 as base2
WORKDIR /usr/src
COPY public/package.json /usr/src/
RUN apk add --no-cache --virtual .build-deps bash alpine-sdk python \
 && yarn install --production \
 && apk del .build-deps

FROM mhart/alpine-node:base-10.10.0
WORKDIR /usr/src
ENV NODE_ENV="production"
COPY --from=base /usr/src .
COPY --from=base2 /usr/src/node_modules ./node_modules
EXPOSE 5000
CMD ["./node_modules/.bin/serve"]
