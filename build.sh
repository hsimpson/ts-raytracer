#!/bin/sh

cd /home/build && \
git clone https://github.com/hsimpson/ts-raytracer.git
cd ts-raytracer

# git config
# git config user.name "$GIT_CONFIG_NAME"
# git config user.email "$GIT_CONFIG_EMAIL"

# npm install
npm install

# building
npm run build

#deploy
# git remote set-url origin https://git:${GITHUB_TOKEN}@github.com/hsimpson/ts-raytracer.git
git remote set-url origin https://${GITHUB_TOKEN}@github.com/hsimpson/ts-raytracer.git
npx gh-pages -d dist -u "$GIT_CONFIG_NAME <$GIT_CONFIG_EMAIL>"
