FROM node:18.13.0-alpine as build
RUN npm install -g pnpm

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .

RUN npm run prisma:gen
RUN npm run build

# # ------------------dev -------------------

FROM node:18.13.0-alpine as dev
RUN npm install -g pnpm

WORKDIR /app

COPY --from=build /app/.env.dev ./.env
COPY --from=build /app/package.json .
COPY --from=build /app/pnpm-lock.yaml .
COPY --from=build /app/resources ./resources
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules/ ./node_modules/
COPY --from=build /app/dist/ ./dist/

# migrate db to production(dev)
# run the app
# without seed: npm run prisma:deploy && npm run prisma:gen && node dist/app.js
# with seed: npm run prisma:deploy && npm run prisma:gen && npm run seed && node dist/app.js
# npm run rollback && [if failed we will rollback first]
CMD ["/bin/sh", "-c", "sleep 20 && echo 'sleep end, start deploy.....' && npm run prisma:deploy && npm run prisma:gen && node dist/src/server.js"]


# # ------------------staging -------------------

FROM node:18.13.0-alpine as staging
RUN npm install -g pnpm

WORKDIR /app

COPY --from=build /app/.env.staging ./.env
COPY --from=build /app/package.json .
COPY --from=build /app/pnpm-lock.yaml .
COPY --from=build /app/resources ./resources
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules/ ./node_modules/
COPY --from=build /app/dist/ ./dist/

# migrate db to production(staging)
# run the app
# without seed: npm run prisma:deploy && npm run prisma:gen && node dist/app.js
# with seed: npm run prisma:deploy && npm run prisma:gen && npm run seed && node dist/app.js
# npm run rollback && [if failed we will rollback first]
CMD ["/bin/sh", "-c", "sleep 20 && echo 'sleep end, start deploy.....' && npm run prisma:deploy && npm run prisma:gen && node dist/src/server.js"]


# # ------------------prod -------------------

FROM node:18.13.0-alpine as prod
RUN npm install -g pnpm

WORKDIR /app

COPY --from=build /app/.env.prod ./.env
COPY --from=build /app/package.json .
COPY --from=build /app/pnpm-lock.yaml .
COPY --from=build /app/resources ./resources
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules/ ./node_modules/
COPY --from=build /app/dist/ ./dist/

# migrate db to production(prod)
# run the app
# without seed: npm run prisma:deploy && npm run prisma:gen && node dist/app.js
# with seed: npm run prisma:deploy && npm run prisma:gen && npm run seed && node dist/app.js
# npm run rollback && [if failed we will rollback first]
CMD ["/bin/sh", "-c", "sleep 10 && echo 'sleep end, start deploy.....' && npm run prisma:deploy && npm run prisma:gen && node dist/src/server.js"]