import fs from 'node:fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import sharp from 'sharp';
import { error } from 'node:console';

export const generateImageName = (name: string) => {
  const regex = /[.* +?^${}()%|'"/[\]\\]/g;
  const img_name = name.replaceAll(regex, '_');
  return img_name + '_' + uuidv4() + '.webp';
};

export const saveImage = async (imageFile: any, fileName: string) => {
  return await sharp(imageFile.data, { animated: imageFile.mimetype === 'image/gif' ? true : false })
    .toFile(path.resolve(path.resolve(__dirname), '../static', fileName))
    .then((info) => info)
    .catch((error) => {
      console.log('saveImage Error: ', error);
      return null;
    });
};

export const deleteImage = (imageName: string) => {
  fs.unlink(path.resolve(path.resolve(__dirname), '../static', imageName), (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error(`deleteImage - The file (${imageName}) does not exist`);
      } else {
        console.error(`deleteImage ` + err.message);
      }
      return false;
    }
  });
  return true;
};

export function sliceObject(obj: any, len: number) {
  if (Object.keys(obj).length <= len) return obj;
  let p = Object.keys(obj).slice(Object.keys(obj).length - 5);
  return Object.fromEntries(p.map((v) => [v, obj[v]]));
}
