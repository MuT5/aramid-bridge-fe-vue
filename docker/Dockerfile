FROM node:22 AS build
WORKDIR /src
RUN apt update && apt dist-upgrade -y && apt-get autoremove --yes && rm -rf /var/lib/{apt,dpkg,cache,log}/
RUN npm install -g npm@latest
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci
RUN npx browserslist@latest --update-db
COPY . .
ENV CI=true
RUN npm audit fix --force --save &>/dev/null
RUN echo "Building the project..."
RUN npm run type-check && echo "type-check completed successfully."
RUN npm run build-only; echo "Build exit code: $?"; echo "Build completed successfully."
RUN cd /src/dist && ls

FROM nginxinc/nginx-unprivileged:latest
USER root
RUN sed -i 's~nginx:x:101:101:nginx user,,,:/nonexistent:/bin/false~nginx:x:101:101:nginx user,,,:/app:/bin/bash~g' /etc/passwd
RUN apt update && apt dist-upgrade -y && apt install -y bc mc wget telnet git curl net-tools iotop atop vim dnsutils jq iproute2 && apt-get autoremove --yes && rm -rf /var/lib/{apt,dpkg,cache,log}/
RUN mkdir /app
RUN chown nginx:nginx /app -R
USER nginx
COPY --from=build /src/dist /app
COPY docker/default.conf /etc/nginx/conf.d/default.conf
USER root
RUN chown nginx:nginx /app -R
RUN chown nginx:nginx /etc/nginx/conf.d -R
RUN chmod 0600 /etc/nginx/conf.d -R
RUN chmod 0700 /etc/nginx/conf.d
USER nginx
