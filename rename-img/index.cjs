const fs = require('fs');
const ExifImage = require('exif').ExifImage;

const directory = './img';
const outPutDirectory = './dist'

fs.readdir(directory, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach(file => {
    // 匹配格式
    if (file.match(/\.(jpg|jpeg)$/i)) {
      new ExifImage({ image: `${directory}/${file}` }, function (error, exifData) {
        if (error)
          console.log('Error: ' + error.message);
        else
          console.log(exifData.image); // Do something with your data!

        const { } = exifData.image
      });

      // fs.readFile(`${directory}/${file}`, (err, data) => {
      //   if (err) {
      //     console.error('Error reading file:', err);
      //     return;
      //   }

      //   exif.read(data, (err, result) => {
      //     if (err) {
      //       console.error('Error reading EXIF data:', err);
      //       return;
      //     }
      //     console.log('result', result)
      //     return
      //     if (result && result.DateTimeOriginal) {
      //       const date = new Date(result.DateTimeOriginal);
      //       const year = date.getFullYear();
      //       const month = ('0' + (date.getMonth() + 1)).slice(-2);
      //       const day = ('0' + date.getDate()).slice(-2);
      //       const hours = ('0' + date.getHours()).slice(-2);
      //       const minutes = ('0' + date.getMinutes()).slice(-2);
      //       const seconds = ('0' + date.getSeconds()).slice(-2);
      //       const newName = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}${file.match(/\.(jpg|jpeg)$/i)[0]}`;
      //       const newFilePath = `${outPutDirectory}/${newName}`;

      //       fs.rename(`${directory}/${file}`, newFilePath, (err) => {
      //         if (err) {
      //           console.error(`Error renaming file ${file} to ${newName}:`, err);
      //         } else {
      //           console.log(`Renamed ${file} to ${newName}`);
      //         }
      //       });
      //     } else {
      //       console.log(`No DateTimeOriginal found for file ${file}`);
      //     }
      //   });
      // });
    }
  });
});
