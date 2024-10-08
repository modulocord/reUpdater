# reUpdater

An open source alternative to/replacement of Discord's Rust-programmed `updater.node`.

For questions read `faq.md`.

For support join: https://discord.gg/SP4syJnFqg

## License notice

Before/On v1.0.1, the license of this project used is the MIT license. However, the subsequent versions after v1.0.1 will be in MPL license. If you use anything after v1.0.1, please open source your version of reUpdater, or if you did not make any changes, please mention that you use reUpdater in your project/modification.

## Status

It's now stable in terms of usability.

Note: v1.x.x is now in maintenance mode as development shifted to v2.x.x, there will be no new features added in v1.x.x.

## For people who implement custom update server API.

`X-Content-Length` is to bypass a weird issue in Express.js/Node.js where setting `Content-Length` does not even set. For best results please set both.

## Usage

### For normal users
1. Download `release.zip`. 
2. Go to `discordDir/app-latest.version.here/`, delete (or rename) the `updater.node` file and create a folder named `updater`. 
3. Extract the files inside.
4. If you have any `was compiled against a different Node.js version` problems please find the Electron version used and run `./node_modules/.bin/electron-rebuild -v (electron version here)` from the `updater` folder.

### For people who want to try out HEAD changes
1. Download the latest source build.
2. Extract and run `npm i` inside.
3. Run `./node_modules/.bin/electron-rebuild -v (electron version here)`
4. Run `npm run build`.
5. Go to `discordDir/app-latest.version.here/`, delete (or rename) the `updater.node` file and create a folder named `updater`. 
6. Copy `dist`, `node_modules` and `package.json` inside.

### For developers
1. Download the latest source build.
2. Extract and run `npm i` inside.
3. Run `./node_modules/.bin/electron-rebuild -v (electron version here)`
4. Run `npm run dev`.
5. Go to `discordDir/app-latest.version.here/`, delete (or rename) the `updater.node` file and create a folder named `updater`. 
6. Copy `dist`, `node_modules` and `package.json` inside.

Alternatively you can package this with [a repacker](https://github.com/cordpackers/rePacker) and setup your own update environment via [Wumpdle](https://github.com/cordpackers/Wumpdle). (recommended method if you want to test)
