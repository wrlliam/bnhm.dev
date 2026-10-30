# syntax=docker/dockerfile:1.10
# bnhm.dev: static Next.js export served by Caddy as a non-root user.

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

# ---------- caddy binary without file capabilities ----------
# The stock binary carries cap_net_bind_service as a file capability, which
# no-new-privileges + cap_drop: ALL refuse to exec. We bind :8080, so a plain
# copy (which drops the xattr) is all we need.
FROM caddy:2-alpine AS caddy
RUN cp /usr/bin/caddy /caddy

# ---------- runtime ----------
FROM alpine:3.22
# mailcap: MIME types (e.g. woff2) for the file server.
RUN apk add --no-cache mailcap \
 && addgroup -S -g 10001 web && adduser -S -D -H -u 10001 -G web web \
 && mkdir -p /tmp/caddy && chown web:web /tmp/caddy
COPY --from=caddy /caddy /usr/bin/caddy
ENV XDG_CONFIG_HOME=/tmp/caddy XDG_DATA_HOME=/tmp/caddy
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build --chown=web:web /app/out /srv
USER web
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
