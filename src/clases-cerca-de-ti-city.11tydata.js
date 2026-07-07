module.exports = {
  eleventyComputed: {
    title: (data) => `${data.city.city} — clases-cerca-de-ti`,
    description: (data) =>
      `Dirección, horario y contacto para las clases de Satanás en ${data.city.city}.`,
    mapEmbedSrc: (data) => {
      const q = data.city && data.city.mapEmbedQuery;
      if (!q || typeof q !== "string") return "";
      return (
        "https://www.google.com/maps?q=" +
        encodeURIComponent(q.trim()) +
        "&output=embed"
      );
    },
    speaker: (data) => {
      const slug = data.city && data.city.speakerSlug;
      if (!slug) return null;
      return (data.speakers || []).find((s) => s.slug === slug) || null;
    },
  },
};
