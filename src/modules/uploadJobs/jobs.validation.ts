import { AppError } from "../../utils/AppError";

const ALLOWED_MIME_TYPES = [
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/pdf",
];

type ValidateJobUploadPayload = {
  file?: Express.Multer.File;
  mapping?: string;
};

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
