FROM mcr.microsoft.com/devcontainers/typescript-node:5-24-trixie

# pnpm comes from corepack, pinned by "packageManager" in package.json.
RUN corepack enable \
  && apt-get update \
  && apt-get install -y --no-install-recommends postgresql-client \
  && rm -rf /var/lib/apt/lists/*

# The pnpm-store volume mounts below this path. Without it in the image, Docker
# creates the parent directories root-owned and pnpm can't write next to the
# store (e.g. pnpm/global).
RUN mkdir -p /home/node/.local/share/pnpm/store \
  && chown -R node:node /home/node/.local
