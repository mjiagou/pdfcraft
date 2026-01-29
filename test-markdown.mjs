import { unified } from 'unified';
import remarkParse from 'remark-parse';
import html from 'remark-html';

const content = `
# Title
这里开始写正文内容...
支持 **Markdown** 语法。
`;

async function main() {
    const processed = await unified()
        .use(remarkParse)
        .use(html)
        .process(content);
    console.log('--- Output (unified) ---');
    console.log(processed.toString());
}

main();
