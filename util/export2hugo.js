// 将 posts 从数据库取出，生成 hugo 格式的 markdown 文档

const db = require('../lib/rdb');
const log = require('solog');
const fs = require('fs');

let tags;
db.table('tags')
    .map(tag =>
        [tag("_id"), tag("name")]
)
    .coerceTo("object")
    .then(
    _tags => {
        tags = _tags; 
        db.table('posts')
            .filter({ _projectId: '5523e1c14c248b9727c794cb' })
            // .limit(2)
            .then(posts => {
                posts.forEach( createHugoFile )
            })
            .then(() => {
                log.info('finish!');
                // process.exit();
            })

    }
)

function createHugoFile(post) {
    let hugoStr = hugoFormat(post);
    let fileName = `/tmp/tb_${post._id}.md`;
    // log.debug(hugoStr);
    
    fs.writeFile(fileName, hugoStr, err => { 
        if (err) throw err;
        log(`file ${fileName} created!`)
    });
}

function getTagsNameJsonStr(tagIds) {
    return JSON.stringify(tagIds.map(_tagId => tags[_tagId]));
}

function hugoFormat(post) {
    let result = `---
title: "${post.title.replace(/"/g,'\\"')}"
tags: ${getTagsNameJsonStr(post.tagIds)}
date: ${post.created}
authors: ["somax"]
draft: true
---

> 这篇文章（${post._id}）是从 Teambition 迁移过来的

${post.postMode === 'md' ? post.content : post.html}
`;

    return result;
}