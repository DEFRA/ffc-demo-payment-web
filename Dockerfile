ARG PARENT_VERSION=1.0.0-node12.16.0
ARG PORT=3000
ARG PORT_DEBUG=9229
ARG REGISTRY

# Development
FROM defradigital/node-development:${PARENT_VERSION} AS development
ARG PARENT_VERSION
ARG REGISTRY
LABEL uk.gov.defra.ffc.parent-image=${REGISTRY}/ffc-node-development:${PARENT_VERSION}
ARG PORT
ENV PORT ${PORT}
ARG PORT_DEBUG
EXPOSE ${PORT} ${PORT_DEBUG}
USER root
RUN  apk --no-cache add ca-certificates wget bash \
  && wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub \
  && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.29-r0/glibc-2.29-r0.apk \
  && apk add glibc-2.29-r0.apk
USER node
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .
RUN npm run build
CMD [ "npm", "run", "start:watch" ]

# Production
FROM defradigital/node:${PARENT_VERSION} AS production
ARG PARENT_VERSION
ARG REGISTRY
LABEL uk.gov.defra.ffc.parent-image=${REGISTRY}/ffc-node:${PARENT_VERSION}
ARG PORT
ENV PORT ${PORT}
EXPOSE ${PORT}
COPY --from=development /home/node/app/ ./app/
COPY --from=development /home/node/package*.json ./
RUN npm ci
CMD [ "node", "app" ]
