FROM node:18.17.1-bookworm-slim AS builder
ARG NEXT_PUBLIC_BASE_URL
WORKDIR /octopus_client
COPY /octopus_client/package.json ./
RUN npm install
COPY /octopus_client/LICENSE /octopus_client/README.md /octopus_client/next-env.d.ts /octopus_client/next.config.js /octopus_client/package.json /octopus_client/postcss.config.js /octopus_client/tailwind.config.js /octopus_client/tsconfig.json /octopus_client/yarn.lock ./
COPY /octopus_client/public public/
COPY /octopus_client/src src/
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM node:18.17.1-bookworm-slim AS prod
ARG NEXT_PUBLIC_BASE_URL
WORKDIR /octopus_client
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 999 nodejs
RUN adduser --system --uid 999 nextjs

COPY --from=builder --chown=nextjs:nodejs /octopus_client/.next ./.next
COPY --from=builder /octopus_client/node_modules ./node_modules
COPY --from=builder /octopus_client/public ./public
COPY --from=builder /octopus_client/package.json ./package.json

RUN chown -R root:root /octopus_client

EXPOSE 3000
ENV PORT 3000
CMD ["npm", "start"]
