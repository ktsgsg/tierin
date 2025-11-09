# ...existing code...
FROM node:24-alpine AS builder
WORKDIR /tierin
COPY package*.json ./
RUN npm ci
COPY . .