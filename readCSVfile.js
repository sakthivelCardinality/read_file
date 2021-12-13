const csv = require('csv-parser');
const fs = require('fs');

const fileName = 'updateCounty.sql';

const CSVFileName =
  './AIS - EO Transition - MX to CB - Report for QASE Update - Production - 12122021.csv';

try {
  if (fs.existsSync(fileName)) {
    fs.unlinkSync(fileName);
  }
} catch (error) {
  console.error(error);
}

fs.createReadStream(CSVFileName)
  .pipe(csv())
  .on('data', (row) => {
    // console.log(row);

    const query = `update dbo."Application" set "IntakeOfficeName" = '${row.IntakeOfficeName}' where "ApplicantGenId" = ${row.CaseNumber} and "ApplicationSequence" = ${row.CaseSeqNumber};\n`;

    // console.log(`🚀 ~ file: readCSVfile.js ~ line: 28 ~ query`, query);

    try {
      fs.appendFileSync(fileName, query);
    } catch (error) {
      console.error(error);
    }
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
