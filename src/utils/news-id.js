const axios = require("axios");
const cheerio = require("cheerio");

const fetchNewsDetail = async (id) => {
  const url = `https://takagi.sousou-no-frieren.workers.dev/news/detail/id/${id}?lang=id`;

  try {
    const response = await axios.get(url);
    return parseNewsDetail(response.data);
  } catch (error) {
    console.error("Error fetching news detail:", error);
    return null;
  }
};

const parseNewsDetail = (html) => {
  const $ = cheerio.load(html);
  const data = {};

  const title = $(".entry-news__detail h3").text();
  const date = $(".metadata2.mb-2").text();

  const content = $(".MsoNormal")
    .map((i, el) => {
      $(el).find('span[style*="mso-tab-count"]').remove();
      return $(el).text().trim();
    })
    .get();
  const imageUrls = $(".MsoNormal img")
    .map((i, el) => $(el).attr("src"))
    .get();

  data["judul"] = title;
  data["tanggal"] = date;
  data["konten"] = content.join("\n");
  data["gambar"] = imageUrls.length > 0 ? imageUrls : null;

  return data;
};

module.exports = {
  fetchNewsDetail,
};
