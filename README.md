# Kentico Kontent Hugo article sample
Sample [Hugo static site generator](https://gohugo.io/) project using the [Kentico Kontent Delivery JavaScript SDK](https://github.com/Kentico/kontent-delivery-sdk-js) to retrieve content.

This application is meant for use with the Dancing Goat sample project within Kentico Kontent. If you don't have your own Sample Project, any administrator of a Kentico Kontent subscription [can generate one](https://app.kontent.ai/sample-project-generator).

## Application setup

### Running the application
To run the app:
1. Clone the app repository with your favorite GIT client
1. Open the solution in Visual Studio Code or your favorite IDE
1. Update the Kontent project ID in `cms-scripts\config.js` (detailed instructions available below)
1. From the terminal run:
   1. `npm install`
   1. `npm run build`
   1. `npm start`
   
- Running `npm run build` creates markdown copies of the Dancing Goat sample articles in the `content/articles` directory.
- Running `npm start` starts the Hugo server on `http://localhost:1313` and a webhook endpoint at `http://localhost:3000` . Information regarding webhooks can be seen in the "Setting up webhooks" section.
- Running `npm start-themed` runs a styled version of the site. More information regarding themes can be seen in the "Using a theme" section.

Alternatively, you can run `npm run build && hugo serve` in the terminal to run just the Hugo site without the webhook functionality. More information about Hugo's server commands can be seen in their documentation [here](https://gohugo.io/commands/hugo_server/#readout).

### Connecting to your sample project
If you already have a [Kentico Kontent account](https://app.kontent.ai), you can connect this application to your version of the Sample project.

1. In Kentico Kontent, choose Project settings from the app menu
1. Under Development, choose API keys and copy the Project ID
1. Open the `cms-scripts\config.js` file
1. Use the values from your Kentico Kontent project in the Delivery Client initialization:

```javascript
const KenticoContent = require('@kentico/kontent-delivery');

const deliveryClient = new KenticoContent.DeliveryClient({
    projectId: '<your_project_id>',
});

exports.deliveryClient = deliveryClient;
```
1. Save the changes
1. Run the application from the terminal

## Setting up webhooks
Webhooks can be used to create or remove markdown files from `content\articles` when an article is published or unpublished in Kentico Kontent. The URL of the application needs to be publicly accessible, e.g. https://myboilerplate.azurewebsites.net/hook or by using a tunneling/routing service like [ngrok](https://ngrok.com/):

1. [Create a webhook in Kentico Kontent](https://docs.kontent.ai/tutorials/develop-apps/integrate/webhooks#a-create-a-webhook) and point it to your application's domain with "/hook" appended to the URL. Example: https://8dbe14c768be.ngrok.io/hook
1. Ensure that the webhook is setup for the "Publish" and "Unpublish" Delivery API triggers
1. Open the sample site in your IDE
1. Run `npm start` in the terminal to run both the site and webhook
1. Make an edit to an article in Kentico Kontentand promote it through the workflow to the "Published" step

## Using a Theme
Hugo has a large list of [available themes](https://themes.gohugo.io/) that can be applied to your site and modified to fit your needs. This site uses the [Pickles](https://github.com/mismith0227/hugo_theme_pickles/tree/release) theme with modified `index.html` and `list.html` layouts to target the "articles" content directory rather than the "posts" content directory.

To start this project with the Pickles theme:
1. Run `npm run start-themed

To run the themeless version:
1. Run `npm run start`

## Content administration
1. Navigate to <https://app.kontent.ai> in your browser.
1. Sign in with your credentials.
1. Manage content in the content administration interface of your sample project.

You can learn more about content editing with Kentico Kontent in our [Documentation](https://docs.kontent.ai/).

### This sample site also uses:

- [Node.js](https://nodejs.org/)
- [npm-run-all](https://github.com/mysticatea/npm-run-all/tree/bf91f94ce597aa61da37d2e4208ce8c48bc86673)
- [Express.js](https://expressjs.com/)
- [Turndown.js](https://github.com/domchristie/turndown)
