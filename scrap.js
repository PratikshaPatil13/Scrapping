const request = require("request-promise")
const cheerio = require("cheerio")
const fs = require("fs")
const json2csv = require("json2csv").Parser;

const movies = ["https://www.imdb.com/title/tt0068646/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=e31d89dd-322d-4646-8962-327b42fe94b1&pf_rd_r=7B6VV59QXR1A0RHQEHQ5&pf_rd_s=center-1&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_tt_2",
                "https://www.imdb.com/title/tt6473300/?ref_=nv_sr_srsg_3",
                "https://www.imdb.com/title/tt6077448/?ref_=tt_sims_tti"];

(async() => {
    let imdbData = []
    
    for(let movie of movies){
        const response = await request({
            uri: movie,
            headers: {
                "accept": "*/*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            },
            gzip: true,
        });
    
        let $ = cheerio.load(response)
        let Title = $('div[class="title_wrapper"] > h1').text().trim()
        let Rating = $('div[class="ratingValue"] > strong > span').text()
        let ReleaseDate = $('a[title="See more release dates"]').text()
    
        imdbData.push({
            Title,
            Rating,
            ReleaseDate,
        });
    }

    const j2csv = new json2csv();
    const csv = j2csv.parse(imdbData);

    fs.writeFileSync("./imd.csv", csv, "utf-8");
}
)();


