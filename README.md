_(documentation related to environment setup and deployments can be found [here](http://bit.ly/1iQkAAW))_

Shopify Build Tool
=====================

This repository contains a fully capable Gulpfile.js intended for use with Shopify theme builds. It also includes the accompanying directory structure used alongside the build tool, as well as a number of blank or very basic `.scss`, `.js`, and `.liquid` files commonly used in a Shopify theme build.

#### Things this build tool includes and/or will do:
- Build a proper directory structure for your theme to be uploaded
- Compile, autoprefix, and minify your .scss to .css (strictly using libsass)
- Concatenate and minify your JavaScript files
- Compile, concatenate, autoprefix, and minify all your vendor JavaScript and .scss/.css into their own vendor.js/vendor.css files
- Inline sourcemaps to both main.js and main.css to help with debugging
- After initial build, will watch your theme files and preforming the necessary tasks on change
- Optionally upload any changed file to a Shopify store of your choosing, without needing to worry about VCS and overwriting someone else's files

## Installation

After cloning the repository and moving into its root, from the command line run `npm install`. After the installation completes, you'll have access to to all of the gulp tasks.

## Tasks

#### Usage
`gulp [TASK] [OPTIONS...]`

### Available tasks
- `clean`  clears out everything in the deploy/ directory
- `styles`  compiles, autoprefixes, minifies, attaches sourcemap, and renames main.scss manifest located in dev/styles to deploy/assets/main.css.liquid
- `scripts`  concatenates, minifies, attaches sourcemap, and renames every .js file located in dev/scripts to deploy/assets/scripts.js.liquid
- `vendor` compiles, concatenates, autoprefixes, and minifies every .scss file located in vendor/styles and every .js file located in vendor/scripts into deploy/assets/vendor.css and deploy/assets/vendor.js
- `copy`  copies every file in dev/liquid into deploy/ carrying the same directory structure
- `build`  runs and completes `clean` before running `copy` `styles` `scripts` `vendor` and `imagemin` asynchronously
`--env [environment name]`, where `[environment name]` is the attribute inside of "./config.js that holds all the relavent data for the store you want to upload to (e.g. api key). If `--env` is entered, but no environment given, it defaults to "staging"

### Commonly run tasks
- `gulp` -cleans, rebuilds, and watches theme files without uploading to a Shopify store
- `gulp --env` -cleans, rebuilds, watches theme files, and uploads to whatever the default environment has been set to in the Gulpfile.
- `gulp --env [environment name]` -cleans, rebuilds, watches theme files, and uploads to [environment name] in config.json

Keep in mind that simply running `gulp` will fire off a number of those tasks in a specific order designed to make your development as easy as possible. Ideally you would only need to run `gulp` (or `gulp --env [environment name]`) once at the start of your project and then never again interact with the build tool while it takes care of chores for you in the background.

Submit a pull request or share if you have any additional ideas.
