# Étape 1 : Build de l'application React
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Définition de l'URL de l'API pour le build (utilisé par Vite)
# On utilise /api pour profiter du reverse proxy Nginx
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Étape 2 : Serveur de production Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copier une config nginx personnalisée pour gérer le routage SPA et le proxy API
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
