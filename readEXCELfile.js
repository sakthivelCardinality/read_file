const readXlsxFile = require('read-excel-file/node');
var XLSX = require('xlsx');
const fs = require('fs');

// Readable Stream.
// readXlsxFile(
//   fs.createReadStream(
//     './Missing_ApplicationPovertyLevel_Production_10052021.xlsx'
//   )
// ).then((rows) => {
//   console.log(rows);
// });

var workbook = XLSX.readFile(
  './AISCasesCreatedOrUpdatedAfterDBRefresh_UAT_03102022.xlsx'
);
var sheet_name_list = workbook.SheetNames;
// console.log(sheet_name_list);
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

const fileName = 'insertQuery.sql';

try {
  if (fs.existsSync(fileName)) {
    fs.unlinkSync(fileName);
  }
} catch (error) {
  console.error(error);
}

const baseQuery = `INSERT INTO public.aisschedulerdetails
(aisschedulerid, casenumber, caseseqnumber, caseupdateddate, status, attempt, errorcode, errormessage, createdate, updateddate)
VALUES
`;
try {
  fs.appendFileSync(fileName, baseQuery);
} catch (error) {
  console.error(error);
}

xlData.map((value, index) => {
  console.log(index + 1 + ' - ' + xlData.length);
  let query = `('7029c107-46c3-4975-a6a0-17a44bd373a0'::uuid, '${value.CaseNumber}', ${value.CaseSeqNumber}, current_timestamp, 'improgress_1', 0, NULL, NULL, NULL, NULL), \n`;
  if (parseInt(index + 1) === parseInt(xlData.length)) {
    query = query.replace(/,\s*$/, ';');
  }
  try {
    fs.appendFileSync(fileName, query);
  } catch (error) {
    console.error(error);
  }
});
