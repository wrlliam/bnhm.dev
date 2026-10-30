# syntax=docker/dockerfile:1.10
# bnhm.dev: static Next.js export served by `serve` on :5000 as a non-root user.
# TLS and hostname are handled by an external reverse proxy.

# ---------- build ----------
FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# The contact address is optional at build time: the encoded parts are
# committed. If you pass it, use a BuildKit secret so it never lands in a
# layer or the image history:
#   docker buildx build --secret id=contact_email,env=CONTACT_EMAIL ...
RUN --mount=type=secret,id=contact_email,env=CONTACT_EMAIL,required=false \
    npm run build

# ---------- runtime ----------
FROM node:22-alpine
ENV NODE_ENV=production
RUN npm install -g --no-audit --no-fund serve@14.2.6 && npm cache clean --force
WORKDIR /app
COPY deploy/serve.json /app/serve.json
COPY --from=build --chown=node:node /app/out /app/out
USER node
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:5000/ || exit 1
CMD ["serve", "out", "-l", "tcp://0.0.0.0:5000", "-c", "/app/serve.json", "--no-clipboard"]
