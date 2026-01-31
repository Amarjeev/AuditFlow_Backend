// import crypto from "crypto";
// import fs from "fs";

// export const createFileHash = (filePath: string) => {
//   const buffer = fs.readFileSync(filePath);

//   return crypto
//     .createHash("sha256")
//     .update(buffer)
//     .digest("hex");
// };

import crypto from "crypto";

export const createFileHashFromBuffer = (buffer: Buffer): string => {
  return crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");
};
