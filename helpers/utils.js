const request = require('request');
const sanitizeHtml = require('sanitize-html');
const cheerio = require('cheerio');
const Post = require('../models/posts');

exports.getUnilagNewsPostsOnPage = (pageNo) => {
    return new Promise((resolve, reject) => {
        let url = `https://unilag.edu.ng/news/${pageNo > 1 ? `page/${pageNo}/` : ''}`
        request(url, (err, response, body) => {

            if (err) reject(err);

            cleanHtml = sanitizeHtml(body, { allowedAttributes: false, allowedTags: false });

            let filtered;
            filtered = sanitizeHtml(cleanHtml, {
                allowedTags: [...sanitizeHtml.defaults.allowedTags, 'h1', 'h2', 'img', 'body', 'span'],
                allowedClasses: { 'h2': ['entry-title'], 'div': ['post', 'fusion-post-content-container'], 'span': ['updated'] },
            });

            let $ = cheerio.load(filtered);

            let htmlOFPosts = [];
            $("div.post").each((i, ele) => {
                dhtml = $(ele).html()
                htmlOFPosts.push(dhtml);
            })

            let posts = htmlOFPosts.map(value => {
                let postDetails = {}
                $ = cheerio.load(value);
                postDetails.title = $('h2.entry-title a').text()
                postDetails.link = $('h2.entry-title a').attr('href')
                postDetails.imageLink = $('img').attr('src') || null;
                // postDetails.shortDescription = $('div.fusion-post-content-container p').text()
                postDetails.updated = new Date($('span.updated').text())
                return postDetails;
            })
            posts.sort((a, b) => b.updated - a.updated);
            resolve(posts);
        })
    })
}

exports.getUnilagNewsPostsOnFirstPage = () => {
    return getUnilagNewsPostsOnPage(1);
}
