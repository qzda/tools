const fs = require("fs");
const ExifImage = require("exif").ExifImage;

const inputDirectory = "./input";
const outputDirectory = "./output";


const inputDirectoryPath = `${__dirname}/${inputDirectory}`
const outputDirectoryPath = `${__dirname}/${outputDirectory}`
fs.readdir(inputDirectoryPath, (err, files) => {
  if (err) {
    console.error(`读取文件夹错误：'${inputDirectoryPath}'`);
    return;
  }

  console.log(files)
  console.log(`共${files.length}个文件\n`);

  files.forEach((file) => {
    // 匹配格式
    if (file.match(/\.(jpg|jpeg)$/i)) {
      const inputFilePath = `${inputDirectory}/${file}`;
      new ExifImage({ image: inputFilePath }, function (error, exifData) {
        if (error) {
          console.error(`获取文件信息失败：${inputFilePath}` + error.message);
        } else {

          const { ModifyDate } = exifData.image;

          // console.log(ModifyDate)
          // return

          const outputFileName = `${ModifyDate.split(':').join('-')}.${file.split('.').at(-1)}`;
          const outputFilePath = `${outputDirectoryPath}/${outputFileName}`;

          fs.rename(inputFilePath, outputFilePath, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`重命名文件："${inputFilePath} -> ${outputFilePath}" 成功！`);
            }
          });
        }
      });
    } else {
      console.error('不可转换的文件格式：', file)
    }

    console.log('\n')
  });
});
