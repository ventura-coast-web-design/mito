module.exports = {
  eleventyComputed: {
    title: (data) => `${data.city.city} — Local Presentations`,
    description: (data) =>
      `Address, schedule, and contact for Myth of Satan presentations in ${data.city.city}.`,
    mapEmbedSrc: (data) => {
      const q = data.city && data.city.mapEmbedQuery;
      if (!q || typeof q !== "string") return "";
      return (
        "https://www.google.com/maps?q=" +
        encodeURIComponent(q.trim()) +
        "&output=embed"
      );
    },
  },
};
