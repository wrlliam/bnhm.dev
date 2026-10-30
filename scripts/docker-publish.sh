#!/usr/bin/env sh
# Build a multi-arch image and push it to Docker Hub.
#   IMAGE=<user>/bnhm-dev ./scripts/docker-publish.sh          # tags :latest and :<git sha>
#   IMAGE=<user>/bnhm-dev TAG=1.2.0 ./scripts/docker-publish.sh
# Log in first: docker login
set -eu

: "${IMAGE:?Set IMAGE, e.g. IMAGE=yourname/bnhm-dev}"
SHA=$(git rev-parse --short HEAD 2>/dev/null || echo dev)
TAG=${TAG:-$SHA}
PLATFORMS=${PLATFORMS:-linux/amd64,linux/arm64}

# Pass the contact address as a BuildKit secret if it is set (never a build arg).
SECRET=""
if [ -n "${CONTACT_EMAIL:-}" ]; then SECRET="--secret id=contact_email,env=CONTACT_EMAIL"; fi

docker buildx inspect bnhm >/dev/null 2>&1 || docker buildx create --name bnhm --use >/dev/null
docker buildx build \
  --builder bnhm \
  --platform "$PLATFORMS" \
  $SECRET \
  --label "org.opencontainers.image.source=https://github.com/wrlliam/bnhm.dev" \
  --label "org.opencontainers.image.revision=$SHA" \
  -t "$IMAGE:$TAG" \
  -t "$IMAGE:latest" \
  --push \
  .

echo "Pushed $IMAGE:$TAG and $IMAGE:latest"
