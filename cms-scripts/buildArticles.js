const { deliveryClient } = require('./config')
const { resolveItemInRichText } = require('./itemResolver');
const { resolveLinkInRichText } = require('./linkResolver');
const markdownConverter = require('./markdownConverter');
const fs = require('fs');


const subscription = deliveryClient.items()
    .type('article')
    .depthParameter(2)
    .queryConfig({
        urlSlugResolver: resolveLinkInRichText,
        richTextResolver: resolveItemInRichText
    })
    .toObservable()
    .subscribe(response => {
        for (var item of response.items){
            //frontmatter
            const title = item.title.value
            const codename = item.system.codename
            //correct mismatch between Kontent date format and Hugo's expected format
            let date = new Date(Date.parse(item.post_date.value))
            date = date.toISOString()

            //article content
            const body_copy = item.body_copy.resolveHtml()
            const teaser_image = item.teaser_image.value[0]

            //convert JSON values to markdown
            const data = markdownConverter.convert(title, date, body_copy, teaser_image)

            fs.writeFileSync(`content/articles/${codename}.md`, data)
        }
        subscription.unsubscribe();
    });





