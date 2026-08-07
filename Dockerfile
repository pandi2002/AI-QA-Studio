FROM mcr.microsoft.com/playwright:v1.52.0-noble
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
# Include this line if your project has a build step (like TypeScript or React)
RUN npm run build
ENTRYPOINT ["node", "index.js"]