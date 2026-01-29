import * as xlsx from "xlsx";

export const parseExcel = (filePath: string) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];

  return xlsx.utils.sheet_to_json(
    workbook.Sheets[sheetName],
    { defval: "" }
  );
};
