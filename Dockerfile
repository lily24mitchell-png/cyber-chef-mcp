FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Default port for Hugging Face Spaces & Cloud hosting
ENV PORT=7860
EXPOSE 7860

CMD ["node", "server.js"]
