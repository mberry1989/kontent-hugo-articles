const { deliveryClient } = require('./config')
const { resolveItemInRichText } = require('./itemResolver');
const { resolveLinkInRichText } = require('./linkResolver');
const markdownConverter = require('./markdownConverter');
const fs = require('fs');

function buildArticle(item_codename) {
const subscription = deliveryClient.item(item_codename)
    .depthParameter(2)
    .queryConfig({
        urlSlugResolver: resolveLinkInRichText,
        richTextResolver: resolveItemInRichText
    })
    .toObservable()
    .subscribe(response => {
        //frontmatter
        const title = response.item.title.value
        const codename = response.item.system.codename
        //correct mismatch between Kontent date format and Hugo's expected format
        let date = new Date(Date.parse(response.item.post_date.value))
        date = date.toISOString()

        //article content
        const body_copy = response.item.body_copy.resolveHtml()
        const teaser_image = response.item.teaser_image.value[0]

        //convert JSON values to markdown
        const data = markdownConverter.convert(title, date, body_copy, teaser_image)
        try {
            fs.writeFileSync(`content/articles/${codename}.md`, data)
            console.log(`Added: content/articles/${codename}.md`);
        } catch (err) {
            // handle the error
            console.log(err);
        }
    
    subscription.unsubscribe();
    });
}

function deleteArticle(item_codename) {
    try {
        fs.unlinkSync(`content/articles/${item_codename}.md`);
        console.log(`Removed: content/articles/${item_codename}.md`);
      } catch (err) {
        // handle the error
        console.log(err);
      }
}

exports.buildArticle = buildArticle;
exports.deleteArticle = deleteArticle;