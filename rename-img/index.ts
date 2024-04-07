import fs from "fs";
import exif, { ExifImage } from "exif";

function renameFile(oldPath: string, newPath: string) {
  const info: {
    status: boolean;
    path: string;
    msg?: string;
  } = {
    status: false,
    path: oldPath,
  };

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      info.msg = err.message;
      throw err;
    } else {
      info.status = true;
    }
  });

  return info;
}

function main(
  inputDir: string,
  outPutDir?: string,
  config?: {
    newInfo?: exif.ExifData["image"];
  }
) {
  const inputDirectoryPath = `${__dirname}/${inputDir}`;
  const outputDirectoryPath = `${__dirname}/${outPutDir || inputDir}`;

  fs.readdir(inputDirectoryPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    const validFiles = files.filter((file) => file.match(/\.(jpg|jpeg)$/i));

    const titleInfo = `A total of ${files.length} files were read, ${validFiles.length} of which were valid`;
    const line = "-".repeat(titleInfo.length + 2);
    console.log(line);
    console.log(` \u001b[3m${titleInfo}\u001b[0m `);
    console.log(line);
    console.log();

    const finishList: ReturnType<typeof renameFile>[] = [];
    const errList: ReturnType<typeof renameFile>[] = [];
    validFiles.forEach((file, index) => {
      const inputFilePath = `${inputDirectoryPath}/${file}`;
      new ExifImage({ image: inputFilePath }, (error, exifData) => {
        if (error) {
          console.error(error);
        } else {
          const fileExifData: exif.ExifData["image"] = {
            ...exifData.image,
          };
          // console.log(fileExifData);
          const { ModifyDate } = fileExifData;

          if (ModifyDate) {
            const outputFileName = `${ModifyDate.split(":").join("-")}.${file
              .split(".")
              .at(-1)
              ?.toLowerCase()}`;
            const outputFilePath = `${outputDirectoryPath}/${outputFileName}`;

            const flag = renameFile(inputFilePath, outputFilePath);

            console.log(
              `${finishList.length + 1} ${
                flag.status
                  ? "\u001b[32msucceed\u001b[0m"
                  : "\u001b[31munsuccessful\u001b[0m"
              } ${file} --> ${outputFileName} `
            );
            if (flag.status) {
              finishList.push(flag);
            } else {
              errList.push(flag);
            }
          }

          if (index === validFiles.length - 1) {
            console.log();
            console.log(
              `Valid: \t${validFiles.length}\t ${inputDirectoryPath}`
            );
            console.log(
              `\u001b[32mFinish: ${finishList.length}\u001b[0m\t ${outputDirectoryPath}`
            );
            console.log(
              `\u001b[31mError: \t${errList.length}\u001b[0m\t ${
                errList[0]?.msg ? errList[0]?.msg : ""
              }...`
            );
          }
        }
      });
    });
  });
}

main("input", "ouput", {
  newInfo: {},
});
// console.log(...arg)
