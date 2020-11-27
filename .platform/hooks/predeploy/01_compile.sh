#!/bin/sh

echo "Installing NPM dependencies..."
npm install

echo "Compiling typescripts..."
npm run compile
