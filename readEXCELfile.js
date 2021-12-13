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
  './Missing_ApplicationPovertyLevel_Production_10052021.xlsx'
);
var sheet_name_list = workbook.SheetNames;
// console.log(sheet_name_list);
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

fs.unlinkSync('insert_query.sql');

const baseQuery = `INSERT INTO public.aisschedulerdetails
(aisschedulerid, casenumber, caseseqnumber, caseupdateddate, status, attempt, errorcode, errormessage, createdate, updateddate)
VALUES
`;
try {
  fs.appendFileSync('insert_query.sql', baseQuery);
} catch (error) {
  console.error(error);
}

xlData.map((value, index) => {
  console.log(index + 1 + ' - ' + xlData.length);
  let query = `('cfbc2da9-4f87-4b50-b7ab-21a4d478715c'::uuid, '${value.CaseFileGenID}', ${value.ApplicationVersionNumber}, current_timestamp, 'improgress_3', 0, NULL, NULL, NULL, NULL), \n`;
  if (parseInt(index + 1) === parseInt(xlData.length)) {
    query = query.replace(/,\s*$/, ';');
  }
  try {
    fs.appendFileSync('insert_query.sql', query);
  } catch (error) {
    console.error(error);
  }
});
