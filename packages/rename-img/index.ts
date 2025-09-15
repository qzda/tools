import fs from "node:fs";
import path from "node:path";
import { ExifImage } from "exif";

function resolvePath(p: string) {
  // Windows: 盘符开头的路径
  if (/^[A-Za-z]:/.test(p)) {
    // 如果没有带 \，自动补一个
    return path.normalize(p.includes("\\") || p.includes("/") ? p : p + "\\");
  }

  // 其它情况，正常判断
  return path.isAbsolute(p) ? p : path.join(__dirname, p);
}

function main(inputDir: string, outPutDir?: string) {
  const inputDirectoryPath = resolvePath(inputDir);
  const outputDirectoryPath = resolvePath(outPutDir || inputDir);

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

    const finishList: string[] = [];
    const errList: { file: string; error: string }[] = [];

    validFiles.forEach((file) => {
      const inputFilePath = path.join(inputDirectoryPath, file);
      new ExifImage({ image: inputFilePath }, (error, exifData) => {
        if (error) {
          console.error(error);
          errList.push({
            file,
            error: error.message,
          });
        } else {
          const { ModifyDate } = exifData.image;

          if (ModifyDate) {
            const ext = path.extname(file).toLowerCase();
            const outputFileName = `${ModifyDate.split(":").join("-")}${ext}`;
            const outputFilePath = path.join(
              outputDirectoryPath,
              outputFileName
            );
            const taskName = `${file} --> ${outputFileName}`;

            try {
              fs.renameSync(inputFilePath, outputFilePath);
              console.log(`${"\u001b[32msucceed\u001b[0m\t"} ${taskName}`);
              finishList.push(file);
            } catch (error) {
              const _err = error as Error;
              console.log(
                `${"\u001b[31munsuccessful\u001b[0m\t"} ${taskName} ${`\u001b[31m${_err.message}\u001b[0m`}`
              );
              errList.push({
                file,
                error: _err.message,
              });
            }
          } else {
            errList.push({
              file,
              error: `ModifyDate not found`,
            });
          }
        }
      });
    });

    const i = setInterval(() => {
      if (finishList.length + errList.length === validFiles.length) {
        console.log();
        console.log(`Valid: \t${validFiles.length}\t ${inputDirectoryPath}`);
        console.log(
          `\u001b[32mFinish: ${finishList.length}\u001b[0m\t ${outputDirectoryPath}`
        );
        console.log(
          `\u001b[31mError: \t${errList.length}\u001b[0m\t ${
            errList[0]?.error ? errList[0]?.error : ""
          }...`
        );
        console.log();

        clearInterval(i);
      }
    }, 100);
  });
}

main("E:\\❤", "E:\\❤\\test");
