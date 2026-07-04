Dockerfile
```
FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "src/app.js"]
```

Issues:
- Running as root (no USER instruction)
- Using latest tag
- No health check
