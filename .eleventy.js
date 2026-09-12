const sass = require("sass");

module.exports = function(eleventyConfig) {
  // Copy static assets (explicit output path so deploy matches local)
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "favicon/": "/" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });

  // Watch for CSS changes
  eleventyConfig.addWatchTarget("./src/css/main.css");

  eleventyConfig.addFilter("locationsMapData", function (cities) {
    if (!Array.isArray(cities)) return "[]";

    return JSON.stringify(
      cities
        .filter(function (city) {
          return (
            city &&
            typeof city.lat === "number" &&
            typeof city.lng === "number" &&
            city.slug
          );
        })
        .map(function (city) {
          var date =
            city.sessions && city.sessions[0] && city.sessions[0].date
              ? city.sessions[0].date
              : "";
          return {
            slug: city.slug,
            city: city.city || "",
            region: city.region || "",
            venueName: city.venueName || "",
            language: city.language || "en",
            date: date,
            lat: city.lat,
            lng: city.lng,
          };
        })
    );
  });

  eleventyConfig.addFilter("navIsActive", function (href, pageUrl) {
    if (!pageUrl || !href) return false;

    const hashIndex = href.indexOf("#");
    const path = hashIndex === -1 ? href : href.slice(0, hashIndex);

    if (path === "/" && hashIndex === -1) {
      return pageUrl === "/";
    }

    if (hashIndex !== -1) {
      return false;
    }

    return pageUrl === path || pageUrl.startsWith(path);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    },
    templateFormats: ["html", "md", "njk"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}; 