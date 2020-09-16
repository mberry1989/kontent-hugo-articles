const resolveLinkInRichText = (link, context) => {
    if (link.type === 'article'){
      return { url: `/articles/${link.codename}`};
    }
    return { url: 'unsupported-link'};
  }

  exports.resolveLinkInRichText = resolveLinkInRichText;