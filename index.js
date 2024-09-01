const fs = require('fs');
const readline = require('node:readline');
const path = require('path');

const filesDir = path.join(__dirname, 'files', 'test.txt');
// получение имени файла
// const fileSplit = filesDir.split(/\\/g)[4];

// функция проверки существования пути
function dirExist() {
  return fs.existsSync(filesDir)
}

// вариант вывода расширения файла первый
// console.log(path.extname(filesDir).split('.').filter(Boolean))

// вариант вывода расширения файла второй
function getFileExtension(filePath) {
  const parts = filePath.split('.').filter(Boolean);
  return parts.length > 1 ? parts.splice(1).join('.') : 'Расширение отстуствует';
}

const readFiles = async() => {
  if (!dirExist()) {
    console.log('путь некорректен')
  } 
  else if ((getFileExtension(filesDir) !== 'txt')) {
    console.log('формат не соответствует txt');
  }
  else {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filesDir);

      stream.on('error', reject);

      const lineReader = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
      });

      const aF = [];

      lineReader.on('line', line => {
        aF.push(line);
      });

      lineReader.on('close', () => {
        console.log(aF)
        fs.writeFileSync('./files/simpledata.json', JSON.stringify(aF, null, 2), {encoding: 'utf8', flag: 'w'});

        let newObj = [{
          title: '',
          author: '',
          body: '',
          priority: 'low'
        }];

        newObj[0].title = aF[0];
        newObj[0].author = aF[1];
        newObj[0].body = aF[2];

        resolve(newObj)
      });
  });
  }
}

((async() => {
  try {
    const resTxtArr = await readFiles();
    const resTxtJson = JSON.stringify(resTxtArr);
    console.log(resTxtArr)
    console.log(resTxtJson)
    console.log(JSON.stringify(resTxtArr, null, 2))
    fs.writeFileSync('./files/data.json', JSON.stringify(resTxtArr, null, 2), {encoding: 'utf8', flag: 'w'});
    // fs.writeFileSync('./files/test.json', resTxtJson, {encoding: 'utf8', flag: 'w'});
  } catch(err) {
    console.error(err);
  }
})())
