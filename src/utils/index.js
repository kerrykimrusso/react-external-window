export function nodeFactory(createElement) {
  return Object.freeze({
    css(url) {
      const linkEl = createElement("link");
      linkEl.setAttribute("type", "text/css");
      linkEl.setAttribute("rel", "stylesheet");
      linkEl.setAttribute("href", url);
      return linkEl;
    },
    js(url) {
      const scriptEl = createElement("script");
      scriptEl.setAttribute("src", url);
      return scriptEl;
    },
  });
}

export function attachResources(document, resources) {
  const factory = nodeFactory(document.createElement.bind(document));
  const attachExternal = attachExternalResource(factory, document);
  resources.forEach(resource => {
    if (typeof resource === "string") {
      attachExternal(parseExtension(resource), resource);
    } else if (Array.isArray(resource)) {
      if (resource.length === 2) {
        const [url, ext] = resource;
        attachExternal(ext, url);
      } else if (resource.length === 3) {
        const [nodes, position, parent] = resource;
        attachNodes(document, nodes, parent, position);
      }
    } else {
      console.warn(
        `react-external-window :: unknown resource format (${resource})`
      );
    }
  });
}

function attachExternalResource(factory, document) {
  return (ext, url) => {
    if (!isUrlAbsolute(url)) return warn(url);
    switch (ext) {
      case "css":
        return document.head.appendChild(factory.css(url));
      case "js":
        return document.body.appendChild(factory.js(url));
      default:
        return console.warn(
          `react-external-window :: unknown extension of external resource (${url})`
        );
    }
  };
}

function attachNodes(document, nodes, parent, position) {
  const parentNode = document[parent];
  const attach =
    position === "append"
      ? node => parentNode.appendChild(node.cloneNode(true))
      : node =>
          parentNode.insertBefore(node.cloneNode(true), parentNode.firstChild);
  if (nodes instanceof Node) {
    attach(nodes);
  } else if (nodes instanceof NodeList) {
    nodes.forEach(attach);
  }
}

function parseExtension(url) {
  const match = url.replace(/\?.*$/, "").match(/\.(\w+)$/i);
  return (match && match[1]) || "";
}

function isUrlAbsolute(url) {
  return /https?:\/\//.test(url);
}

function warn(url) {
  console.warn(
    `react-external-window :: url of resource must be absolute (${url})`
  );
}
