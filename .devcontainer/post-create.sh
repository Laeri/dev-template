#!/usr/bin/env bash
set -euo pipefail

# Named volumes are created root-owned.
sudo chown node:node \
  node_modules \
  apps/web/node_modules \
  packages/*/node_modules

if [ ! -f apps/web/.env ]; then
  cp apps/web/.env.example apps/web/.env
  secret=$(openssl rand -base64 32)
  sed -i "s|^BETTER_AUTH_SECRET=.*|BETTER_AUTH_SECRET=${secret}|" apps/web/.env
  echo "Created apps/web/.env with a fresh BETTER_AUTH_SECRET"
fi

pnpm install --frozen-lockfile

until pg_isready -h postgres -U postgres -q; do sleep 1; done
pnpm db:migrate
