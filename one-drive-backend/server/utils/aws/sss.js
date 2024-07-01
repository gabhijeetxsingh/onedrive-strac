const aws = require('aws-sdk');

const {
  AWS_S3_SECRET_ACCESS_KEY, AWS_S3_ACCESS_KEY_ID, AWS_S3_REGION, AWS_S3_BUCKET_NAME,
} = require('../../config');

aws.config.update({
  secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  region: AWS_S3_REGION,
});
const s3 = new aws.S3();

const upload = async (payload) => {
  const {
    fileName, buffer, mimeType,
  } = payload;

  const output = await new Promise((resolve, reject) => {
    s3.upload({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: `${fileName}`,
      Body: buffer,
      ACL: 'private',
      ContentType: mimeType,
      Tagging: `name=${fileName}`,
    }, (err, response) => {
      if (err) {
        return reject(err);
      }
      const { Location: imageUrl } = response;

      return resolve({ imageUrl, bucketName: AWS_S3_BUCKET_NAME });
    });
  });

  return output;
};

const getObject = async (key, bucketName) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  const response = await new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      const { Body: file } = data;

      return resolve(file);
    });
  });

  return response;
};

const getSignedUrl = async (key, bucketName, expiryInMinutes) => {
  const expiryInseconds = expiryInMinutes * 60;

  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: expiryInseconds,
  };

  const signedUrl = s3.getSignedUrl('getObject', params);

  return signedUrl;
};

module.exports = {
  upload, getObject, getSignedUrl,
};
