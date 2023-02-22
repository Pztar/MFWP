import sanitizeHtml from "sanitize-html";

const sanitizeOption = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["iframe"]),
  allowedAttributes: {
    a: ["href", "name", "target"],
    img: ["src", "style", "width", "height", "align"],
    iframe: [
      "src",
      "class",
      "frameborder",
      "allowfullscreen",
      "width",
      "height",
    ],
    li: ["class"],
  },
  allowedSchemes: ["data", "http", "https"],
};

export default sanitizeOption;
