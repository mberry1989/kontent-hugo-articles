# Kentico Kontent Hugo article sample
[![Netlify Status](https://api.netlify.com/api/v1/badges/3609d056-2b93-44ed-80d9-9a3646ceb25e/deploy-status)](https://app.netlify.com/sites/vigorous-curie-3c2b90/deploys)
A themed demo of this site can be seen [here](https://netlify--vigorous-curie-3c2b90.netlify.app/)

Sample [Hugo static site generator](https://gohugo.io/) project using the [Kentico Kontent Delivery JavaScript SDK](https://github.com/Kentico/kontent-delivery-sdk-js) to retrieve content.

This application is meant for use with the Dancing Goat sample project within Kentico Kontent. If you don't have your own Sample Project, any administrator of a Kentico Kontent subscription [can generate one](https://app.kontent.ai/sample-project-generator).

## Application setup

### Prerequisites
- [Install Hugo](https://gohugo.io/getting-started/installing)
- [Install Node.js](https://nodejs.org/en/)
- [Install dotenv](https://www.npmjs.com/package/dotenv)

### Running the application
To run the app:
1. Clone the app repository with your favorite GIT client
1. Open the solution in Visual Studio Code or your favorite IDE
1. Update the Kontent project ID in `.env` - detailed instructions available [below](#connecting-to-your-sample-project)
1. From the terminal run:
   1. `npm install`
   1. `npm run cms:build`
   1. `npm run local:start`
   
- Running `npm run cms:build` creates markdown copies of the Dancing Goat sample articles in the `content/articles` directory.
- Running `npm run local:start` starts the Hugo server on `http://localhost:1313` and a webhook endpoint at `http://localhost:3000` . Information regarding webhooks can be seen in the [Setting up webhooks](#setting-up-webhooks) section.
- To run a styled version of the site follow steps in the [Using a theme](#using-a-theme) section.

Alternatively, you can run `npm run cms:build && local:serve` in the terminal to run just the Hugo site without the webhook functionality.

### Connecting to your sample project
If you already have a [Kentico Kontent account](https://app.kontent.ai), you can connect this application to your version of the Sample project.

1. In Kentico Kontent, choose Project settings from the app menu
1. Under Development, choose API keys and copy the Project ID
1. Open the `.env` file
1. Use the values from your Kentico Kontent project as the PROJECT_ID value
1. Save the changes
1. Run the application from the terminal

## Setting up webhooks
Webhooks can be used to create or remove markdown files from `content\articles` when an article is published or unpublished in Kentico Kontent. The URL of the application needs to be publicly accessible, e.g. https://myboilerplate.azurewebsites.net/hook or by using a tunneling/routing service like [ngrok](https://ngrok.com/):

1. [Create a webhook in Kentico Kontent](https://docs.kontent.ai/tutorials/develop-apps/integrate/webhooks#a-create-a-webhook) and point it to your application's domain with "/hook" appended to the URL. Example: https://8dbe14c768be.ngrok.io/hook
1. Ensure that the webhook is setup for the "Publish" and "Unpublish" Delivery API triggers
1. Open the sample site in your IDE
1. Run `npm run local:start` in the terminal to run both the site and webhook
1. Make an edit to an article in Kentico Kontent and promote it through the workflow to the "Published" step

### Webhook validation
> coming soon.  In the meantime, reference the [Kentico Kontent documentation](https://docs.kontent.ai/tutorials/develop-apps/integrate/webhooks#a-validate-received-notifications)

## Using a Theme
Hugo has a large list of [available themes](https://themes.gohugo.io/) that can be applied to your site and modified to fit your needs. This site uses a [forked version](https://github.com/kentico-michaelb/hugo_theme_pickles) of the [Pickles](https://github.com/mismith0227/hugo_theme_pickles/tree/release) theme with modified `index.html` and `head.html` layouts.

To add the Pickles theme, in the terminal run:
- `local:build-themed`

To run the site locally with the Pickles theme run:
- `"local:serve-themed"` (without webhooks)
OR
- `"local:start-themed"` (with webhooks. See the: [Setting up webhooks](#setting-up-webhooks) section)

Note: the `local:build-themed` command renames the root `layout/_default` folder to `layout/default`to allow the downloaded theme to override the default layout files.

To run the themeless version:
1. Ensure that `layout/_default` exists in the root layout folder
1. Run `npm run local:start`

## Content administration
1. Navigate to <https://app.kontent.ai> in your browser.
1. Sign in with your credentials.
1. Manage content in the content administration interface of your sample project.

You can learn more about content editing with Kentico Kontent in our [Documentation](https://docs.kontent.ai/).

Note: This project is only setup to support the "Article" content type from the Kentico Kontent Sample project.

## Deploying to Netlify
When deploying to [Netlify](https://www.netlify.com/), set:
1. Build Command: `npm run netlify:build`
1. Publish Directory: `Public`

as well as an [environmental variable](https://docs.netlify.com/configure-builds/environment-variables/):
1. PROJECT_ID: your_project_id (see [Connecting to your sample project](#connecting-to-your-sample-project))

## This sample site also uses:

- [npm-run-all](https://github.com/mysticatea/npm-run-all/tree/bf91f94ce597aa61da37d2e4208ce8c48bc86673)
- [Express.js](https://expressjs.com/)
- [Turndown.js](https://github.com/domchristie/turndown)
