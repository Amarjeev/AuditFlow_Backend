import * as xlsx from "xlsx";

export const parseExcelFromBuffer = (buffer: Buffer) => {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];

  return xlsx.utils.sheet_to_json(
    workbook.Sheets[sheetName],
    { defval: "" },
  );
};
