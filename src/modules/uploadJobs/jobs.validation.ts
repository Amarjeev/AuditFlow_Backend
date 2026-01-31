import { AppError } from "../../utils/AppError";
import { ValidateJobUploadPayload } from "./type/uploadJobs.type";

const ALLOWED_MIME_TYPES = [
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/pdf",
];

export const validateJobUpload = ({
  file,
  mapping,
}: ValidateJobUploadPayload) => {
  if (!file) {
    throw new AppError("File is required", 400);
  }

  if (!mapping) {
    throw new AppError("Mapping is required", 400);
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new AppError(
      "Invalid file type. Only CSV, Excel, or PDF files are allowed",
      400,
    );
  }
};
