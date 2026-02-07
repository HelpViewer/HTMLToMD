function rowsToArray(t) {
  if (!t) return [];
  return t.replace(/\r\n|\r/g, '\n').split('\n');
}

function HTMLToMD(parent, ctx) {
  function clearHash(text) {
    let cleanedText = text;
    if (text.endsWith('#'))
      cleanedText = text.substring(0, text.length - 1);
    return cleanedText.trim();
  }

  const handlerBold = (node, ctx, children) => `**${children}**`;

  const handlers = {
    ul: (node, ctx, children) => children,
    ol: (node, ctx, children) => children,
    li: (node, ctx, children) => {
      if (ctx.listStack.length == 0 || ctx.listStack[ctx.listStack.length-1] != node.parentElement) {
        ctx.listStack.push(node.parentElement);
        ctx.listCounter.push(0);
      }

      ctx.listCounter[ctx.listStack.length-1] += 1;
      
      const itemMarker = node.parentElement.tagName.toLowerCase() != 'ol' ? '-' : `${ctx.listCounter[ctx.listStack.length-1]}.`;
      //${'  '.repeat(Math.max(0, ctx.listStack.length-1))}
      const reply = `${itemMarker} ${children}`;

      if (!node.nextElementSibling) {
        ctx.listStack.pop();
        ctx.listCounter.pop();
      }
      return reply;
    },
    img: (node, ctx, children) => {
      ctx.i_img++;
      const path = ctx.embeds.get(node.src) || '';
      return `![${node.alt || ''}](${path} "${node.title || ''}")\n`;
    },
    svg: (node, ctx, children) => {
      ctx.i_svg++;
      const path = ctx.embeds.get(node) || '';
      return `![${node.alt || ''}](${path} "${node.title || ''}")\n`;
    },
    h1: (node, ctx, children) => `# ${clearHash(children)}\n`,
    h2: (node, ctx, children) => `## ${clearHash(children)}\n`,
    h3: (node, ctx, children) => `### ${clearHash(children)}\n`,
    h4: (node, ctx, children) => `#### ${clearHash(children)}\n`,
    h5: (node, ctx, children) => `##### ${clearHash(children)}\n`,
    h6: (node, ctx, children) => `###### ${clearHash(children)}\n`,
    p: (node, ctx, children) => `${children}\n`,

    div: (node, ctx, children) => {
      if (node.classList.contains('toolbar-item') || node.classList.contains('toolbar'))
        return '';

      if (node.classList.contains('page-break'))
        return '';

      return children;
    },

    code: (node, ctx, children) => {
      if (node.classList.length == 0)
        return `\`\`\`${children}\`\`\``;

      const codeText = node.textContent;
      const prefix = 'language-';
      const langClass = Array.from(node.classList).find(cls => cls.startsWith(prefix));
      let lang = langClass ? langClass.replace(prefix, '') : '';
      lang = lang == 'none' ? '' : lang;

      return `\`\`\`${lang}\n${codeText}\`\`\`\n`;
    },

    strong: handlerBold,
    b: handlerBold,
    em: (node, ctx, children) => `*${children}*\n`,
    table: (node, ctx, children) => children,
    thead: (node, ctx, children) => {
      let cols = rowsToArray(children.trim());
      const mCols = '| --- '.repeat(cols.length) + '|';
      const mColData = '| ' + cols.join(' | ') + ' |';
      return `${mColData}\n${mCols}`;
    },

    td: (node, ctx, children) => children,

    tr: (node, ctx, children) => {
      if (node.parentElement.tagName.toLowerCase() === 'thead') return children;

      const tds = Array.from(node.children).filter(child => 
        child.tagName.toLowerCase() === 'td' || child.tagName.toLowerCase() === 'th'
      );
      
      const colTexts = tds.map(td => walk(td, ctx));
      return '| ' + colTexts.join(' | ') + ' |';
    },

    a: (node, ctx, children) => {
      if (children.trim().replace('\\#', '#').length == 1)
        return '';
      
      let href = node.getAttribute('href') || '';
      //href = decodeURI(href);
      
      return `[${children}](${href} "${node.title}")`;
    },

    script: (node, ctx, children) => '',
    style: (node, ctx, children) => '',
    br: (node, ctx, children) => `\n${children}`,

    default: (node, ctx, children) => children
  };

  function walk(node, ctx) {
    if (node.nodeType === Node.TEXT_NODE) 
      return node.textContent;

    const children = Array.from(node.childNodes)
      .map(child => walk(child, ctx))
      .join('');
    const tag = node.nodeName.toLowerCase();
    const handler = handlers[tag] || handlers.default;
    return handler(node, ctx, children);
  }

  ctx.listCounter = [];
  ctx.listStack = [];
  const reply = walk(parent, ctx);
  return reply.trim();
}
