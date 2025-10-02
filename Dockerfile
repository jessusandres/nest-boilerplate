# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:22-alpine3.18 AS build

ARG PORT
ENV NODE_ENV=production
ENV CI=true
ENV PORT=${PORT}

RUN echo "To expose in port ${PORT}"

# Set the working directory
WORKDIR /usr/src/app

# Copy only package for cache usage
COPY package.json /usr/src/app

# Install all the dependencies
RUN npm install -g pnpm
RUN npm install -g @nestjs/cli
RUN pnpm install --ignore-scripts
# RUN npm install --omit=dev --ignore-scripts

# Add the source code to app
COPY . /usr/src/app/

# Generate the build of the application
RUN npm run build

# Stage 2: Serve the application
FROM node:22-alpine3.18

# Copy the build output to replace the default nginx contents.
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist /usr/src/app

USER node

EXPOSE 8080

CMD ["node", "/usr/src/app/main.js"]

#ENTRYPOINT ["tail", "-f", "/dev/null"]
