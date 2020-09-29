# Kentico Kontent Hugo article sample
[![Netlify Status](https://api.netlify.com/api/v1/badges/3609d056-2b93-44ed-80d9-9a3646ceb25e/deploy-status)](https://app.netlify.com/sites/vigorous-curie-3c2b90/deploys)
A themed demo of this site can be seen [here](https://vigorous-curie-3c2b90.netlify.app/).

Sample [Hugo static site generator](https://gohugo.io/) project using the [Kentico Kontent Delivery JavaScript SDK](https://github.com/Kentico/kontent-delivery-sdk-js) to retrieve content.

This application is meant for use with the Dancing Goat sample project within Kentico Kontent. If you don't have your own Sample Project, any administrator of a Kentico Kontent subscription [can generate one](https://app.kontent.ai/sample-project-generator).

## Table of Contents
- [Application Setup](#application-setup)
- [How It Works](#how-it-works)
  - [Resolving Links and Content Items in Rich Text](#resolving-links-and-content-items-in-rich-text)
- [Setting up Webhooks](#setting-up-webhooks)
- [Using a Theme](#using-a-theme)
- [Content Administration](#content-administration)
- [Deploying to Netlify](#deploying-to-netlify)
- [Getting Support](#getting-support-and-contributing)

## Application Setup

### Prerequisites
- [Install Hugo](https://gohugo.io/getting-started/installing)
- [Install Node.js](https://nodejs.org/en/)
- [Install dotenv](https://www.npmjs.com/package/dotenv)

### Running the Application
To run the app:
1. Clone the app repository with your favorite GIT client
1. Open the solution in Visual Studio Code or your favorite IDE
1. Update the Kontent project ID in `.env` - detailed instructions available [below](#connecting-to-your-sample-project)
1. From the terminal run:
   1. `npm install`
   1. `npm run cms:prepare`
   1. `npm run local:start`
   
- Running `npm run cms:prepare` creates markdown copies of the Dancing Goat sample articles in the `content/articles` directory.
- Running `npm run local:start` starts the Hugo server on `http://localhost:1313` and a webhook endpoint at `http://localhost:3000` . Information regarding webhooks can be seen in the [Setting up webhooks](#setting-up-webhooks) section.
- To run a styled version of the site follow steps in the [Using a theme](#using-a-theme) section.

Alternatively, you can run `npm run cms:prepare && local:serve` in the terminal to run just the Hugo site without the webhook functionality.

### Connecting to your Sample Project
If you already have a [Kentico Kontent account](https://app.kontent.ai), you can connect this application to your version of the Sample project.

1. In Kentico Kontent, choose Project settings from the app menu
1. Under Development, choose API keys and copy the Project ID
1. Open the `.env` file
1. Use the values from your Kentico Kontent project as the PROJECT_ID value
1. Save the changes
1. Run the application from the terminal

## How It Works
To follow the [recommended content organization](https://gohugo.io/content-management/organization/) from the official Hugo documentation, content for this project is stored in the `/content` directory in a subfolder matching the content type (e.g., "articles" in this sample). Additionally, content is stored in the markdown (.md) format to leverage Hugo's default [content management features](https://gohugo.io/content-management/) and fast markdown parsing with minimal custom configuration.

Pulling content from Kentico Kontent and making it usable by Hugo can be broken down into three steps:

- [One: Consuming Content from the API](#one:-consuming-content-from-the-api)
- [Two: Converting Kentico Kontent JSON to Markdown](#two:-converting-kentico-kontent-json-to-markdown)
- [Three: Creating the Physical Markdown files](#three:-creating-the-physical-markdown-files)

handled by two files in cms-scripts: [buildArticles.js](https://github.com/kentico-michaelb/kontent-hugo-articles/blob/master/cms-scripts/buildArticles.js) and [markdownConverter.js](https://github.com/kentico-michaelb/kontent-hugo-articles/blob/master/cms-scripts/markdownConverter.js).

### One: Consuming Content from the API
The `cms:prepare` command uses the [Kentico Kontent Delivery JavaScript SDK](https://github.com/Kentico/kontent-delivery-sdk-js) to return all "article" content items from Kentico Kontent:

```javascript
//code from cms-scripts/buildArticles.js
const { deliveryClient } = require('./config')
//... additional requires removed for brevity

const subscription = deliveryClient.items()
    .type('article')
    .depthParameter(2)
    .queryConfig({
        urlSlugResolver: resolveLinkInRichText,
        richTextResolver: resolveItemInRichText
    })
    .toObservable()
    .subscribe(/*...*/)
```

### Two: Converting Kentico Kontent JSON to Markdown
Since the [Kentico Kontent Delivery JavaScript SDK](https://github.com/Kentico/kontent-delivery-sdk-js) responds in the JSON format, it's necessary to loop through the items returned in step one and have their respective `title, date, body_copy, and teaser_image` converted to the markdown format using [Turndown.js](https://github.com/domchristie/turndown).

```javascript
//code continued from cms-scripts/buildArticles.js
//...
const markdownConverter = require('./markdownConverter');
//...
.subscribe(response => {
        for (var item of response.items){
            //frontmatter example:
            const title = item.title.value
            const body_copy = item.body_copy.resolveHtml()//resolveHtml to resolve rich text markup
            
            //... additional elements removed for brevity

            //convert JSON values to markdown
            const data = markdownConverter.convert(title, date, body_copy, teaser_image)
```

```javascript
//code from cms-scripts/markdownConverter.js
const convert = (title, date, body_copy, teaser_image) => {
//markdown conversion
const turndownService = new TurndownService()
const markdown = turndownService.turndown(body_copy)
const header_image = turndownService.turndown(`<img src="${teaser_image.url}" alt="${teaser_image.description}"/>`)

const data = `---
title: "${title}"
date: ${date}
draft: false 
---
${header_image}
${markdown}
`    

return data

}
```
### Three: Creating the Physical Markdown files
With the JSON data converted to markdown, the final step is to create the physical content markdown files Hugo uses to render the site.

```javascript
//code continued from cms-scripts/buildArticles.js
const fs = require('fs');

//...

.subscribe(response => {
    for (var item of response.items){
        
        //... code emitted for brevity

        fs.writeFileSync(`content/articles/${codename}.md`, data)
    }
```

### Resolving Links and Content Items in Rich Text
The API query used in [cms-scripts\buildArticles.js](https://github.com/kentico-michaelb/kontent-hugo-articles/blob/master/cms-scripts/buildArticles.js) is set to resolve links and inline content items on the query level as described in the Kentico Kontent JavaScript SDK documentation [here](https://github.com/Kentico/kontent-delivery-sdk-js/blob/master/DOCS.md#resolve-url-slugs-on-query-level).

```javascript
//code from cms-scripts/buildArticles.js
const { resolveItemInRichText } = require('./itemResolver');
const { resolveLinkInRichText } = require('./linkResolver');

//... additional requires removed for brevity

const subscription = deliveryClient.items()
    .type('article')
    .depthParameter(2)
    .queryConfig({
        urlSlugResolver: resolveLinkInRichText,
        richTextResolver: resolveItemInRichText
    })
    .toObservable()
    .subscribe(/*...*/)
```

#### Links:
Link resolution is configured in [cms-scripts/linkResolver.js](https://github.com/kentico-michaelb/kontent-hugo-articles/blob/master/cms-scripts/linkResolver.js) to evaluate the "link type" of links returned in the `buildArticles.js` API call, then return a url property handled by the JavaScript SDK.

```javascript
//code from cms-scripts/linkResolver.js
const resolveLinkInRichText = (link, context) => {
    if (link.type === 'article'){
      return { url: `/articles/${link.codename}`};
    }
    return { url: 'unsupported-link'};
  }

  exports.resolveLinkInRichText = resolveLinkInRichText;
```

#### Content Items:
Content item resolution is configured in [cms-scripts/itemResolver.js](https://github.com/kentico-michaelb/kontent-hugo-articles/blob/master/cms-scripts/itemResolver.js) to evaluate the content type of inline content items returned in the `buildArticles.js` API call, then return a [Hugo shortcode](https://gohugo.io/content-management/shortcodes/) that matches the type. Hugo natively supports tweets, vimeo, and youtube videos used in the sample.

```javascript
//code from cms-scripts/itemResolver.js
const resolveItemInRichText = (item) => {
//... code emitted for brevity

    //"host_video" correlates with a content type in Kentico Kontent
    if (item.system.type === 'hosted_video'){
        let video_id = item.video_id.value;
        let host_name = item.video_host.value[0].name;
        
        //"host_name" correlates with a content type element set in Kentico Kontent
        if(host_name === 'YouTube'){            
            return `{{< youtube ${video_id} >}}`
        }
        else if(host_name === 'Vimeo') { 
            return `{{< vimeo ${video_id} >}}`
        }
        else {
            return `> Video unavailable.`
        }
    }
    return `> Content not available.`
}

exports.resolveItemInRichText = resolveItemInRichText;
```

Executing the inline resolution requires calling the JavaScript SDK's `resolveHTML()` method on the rich text element containing the inline content items.

```javascript
//code continued from cms-scripts/buildArticles.js
//...
//article content
const body_copy = item.body_copy.resolveHtml()
```

Examples of resolved links and content items can be seen in the "Coffee Beverages Explained" article.

## Setting up Webhooks
Webhooks can be used to create or remove markdown files from `content\articles` when an article is published or unpublished in Kentico Kontent. The URL of the application needs to be publicly accessible, e.g. https://myboilerplate.azurewebsites.net/hook or by using a tunneling/routing service like [ngrok](https://ngrok.com/):

1. [Create a webhook in Kentico Kontent](https://docs.kontent.ai/tutorials/develop-apps/integrate/webhooks#a-create-a-webhook) and point it to your application's domain with "/hook" appended to the URL. Example: https://8dbe14c768be.ngrok.io/hook
1. Ensure that the webhook is setup for the "Publish" and "Unpublish" Delivery API triggers
1. Open the sample site in your IDE
1. Run `npm run local:start` in the terminal to run both the site and webhook
1. Make an edit to an article in Kentico Kontent and promote it through the workflow to the "Published" step

### Webhook Validation
Reference the [Kentico Kontent documentation.](https://docs.kontent.ai/tutorials/develop-apps/integrate/webhooks#a-validate-received-notifications)

## Using a Theme
Hugo has a large list of [available themes](https://themes.gohugo.io/) that can be applied to your site and modified to fit your needs. This site uses a [forked version](https://github.com/kentico-michaelb/hugo_theme_pickles) of the [Pickles](https://github.com/mismith0227/hugo_theme_pickles/tree/release) theme with modified `index.html` and `head.html` layouts.

To add the Pickles theme, in the terminal run:
- `local:prepare-themed`

To run the site locally with the Pickles theme run:
- `"local:serve-themed"` (without webhooks)
OR
- `"local:start-themed"` (with webhooks. See the: [Setting up webhooks](#setting-up-webhooks) section)

Note: the `local:prepare-themed` command renames the root `layout/_default` folder to `layout/default`to allow the downloaded theme to override the default layout files.

To run the themeless version:
1. Ensure that `layout/_default` exists in the root layout folder
1. Run `npm run local:start`

## Content Administration
1. Navigate to <https://app.kontent.ai> in your browser.
1. Sign in with your credentials.
1. Manage content in the content administration interface of your sample project.

You can learn more about content editing with Kentico Kontent in our [Documentation](https://docs.kontent.ai/).

Note: This project is only setup to support the "Article" content type from the Kentico Kontent Sample project.

## Deploying to Netlify
When deploying to [Netlify](https://www.netlify.com/), set:
1. Build Command: `npm run netlify:build`
1. Publish Directory: `public`

as well as an [environmental variable](https://docs.netlify.com/configure-builds/environment-variables/):
1. PROJECT_ID: your_project_id (see [Connecting to your sample project](#connecting-to-your-sample-project))

## This sample site also uses:

- [npm-run-all](https://github.com/mysticatea/npm-run-all/tree/bf91f94ce597aa61da37d2e4208ce8c48bc86673)
- [Express.js](https://expressjs.com/)
- [Turndown.js](https://github.com/domchristie/turndown)

## Getting Support and Contributing
Ways to contribute and where to get support can be seen in the [contributing guidelines here](https://github.com/kentico-michaelb/kontent-hugo-articles/blob/master/CONTRIBUTING.md).
