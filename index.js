const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

async function main() {
  const result = await request.get(
    "https://www.worldometers.info/coronavirus/"
  );
  const $ = cheerio.load(result);

  const scrapedData = [];
  const tableHeaders = [
    "Country,Other",
    "Total Cases",
    "New Cases",
    "Total Deaths",
    "New Deaths",
    "Total Recovered",
    "Acive Cases",
    "Serious, Critical",
    "Total Cases/1M Population",
    "Deaths/ 1M Population",
    "Total Tests",
    "Tests/1M Population",
    "Continent",
  ];
  //Go to each tr and push each td of each tr into scrapedData.
  $("tbody > tr").each((index, element) => {
    const tds = $(element).find("td");
    const tableRow = {};
    $(tds).each((i, element) => {
      //Added replace to remove unwanted character from text.
      tableRow[tableHeaders[i]] = $(element).text().trim().replace("\n", "");
    });
    scrapedData.push(tableRow);
  });
  //   console.log(scrapedData);
  const j2cp = new json2csv();
  //Convert JSON data in CSV.
  const csv = j2cp.parse(scrapedData);
  //Write converted CSV data into data.csv file.
  fs.writeFileSync("./data.csv", csv);
}

main();
