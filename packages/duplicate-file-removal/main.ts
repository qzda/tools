import { hashFile } from 'hasha';
import path from 'node:path';
import fs from 'node:fs';

function getAllFilePath(dir: string, filter?: (value: string) => boolean): string[] {
  let results: string[] = [];

  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    let stat: fs.Stats;

    try {
      stat = fs.statSync(filePath);
    } catch {
      console.warn(`跳过无法访问的路径: ${filePath}`);
      continue;
    }

    if (stat.isDirectory()) {
      results = results.concat(getAllFilePath(filePath, filter));
    } else if (stat.isFile()) {
      results.push(filePath);
    }
  }

  return filter ? results.filter(filter) : results;
}

async function main(dir: string) {
  const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.mov', '.mp4']);

  const fileList = getAllFilePath(dir, (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    return allowedExtensions.has(ext);
  });

  console.log(`共找到文件: ${fileList.length}`);

  const hashMap = new Map<string, string[]>();

  for (const file of fileList) {
    try {
      const _hash = await hashFile(file, { algorithm: 'md5' });
      const list = hashMap.get(_hash) || [];
      list.push(file);
      hashMap.set(_hash, list);
    } catch {
      console.warn(`跳过无法哈希的文件: ${file}`);
    }
  }

  const duplicates: Record<string, string[]> = {};
  let duplicateCount = 0
  hashMap.forEach((files, hash) => {
    if (files.length > 1) {
      duplicateCount += files.length - 1
      duplicates[hash] = files;
    }
  });

  console.log(`重复文件组数: ${duplicateCount}`);

  fs.writeFileSync('./duplicates.json', JSON.stringify(duplicates, null, 2), {
    encoding: 'utf-8'
  })
}

main('C:/Users/qzda/Pictures/Nikon Z30');
