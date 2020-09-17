const resolveItemInRichText = (item) => {
    if (item.system.type === 'tweet'){
        let tweet = item.tweet_link.value;
        //Hugo shortcodes use only the tweet ID not the full tweet URL
        let tweet_id = tweet.substr(tweet.lastIndexOf('/') + 1);
        return `{{< tweet ${tweet_id} >}}`;

    }
    if (item.system.type === 'hosted_video'){
        let video_id = item.video_id.value;
        let host_name = item.video_host.value[0].name;
        
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
