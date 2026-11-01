# ---------- Stage 1: build the app ----------
FROM node:22-alpine AS build
WORKDIR /app

# Copy only the dependency lists first, so Docker can reuse this
# layer (and skip npm ci) when only your source code changes.
COPY package.json package-lock.json ./
RUN npm ci

# Now copy the source and build it into /app/dist
COPY . .
RUN npm run build

# ---------- Stage 2: serve the built files ----------
FROM nginx:1.27-alpine

# Our server rules replace nginx's default site
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Take only the finished files from stage 1. Node and node_modules stay behind.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80