const TurndownService = require('turndown');

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

exports.convert = convert;