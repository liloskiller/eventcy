@echo off
rd /s /q .next
rd /s /q node_modules
npm install --force
npm run build