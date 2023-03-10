const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3-v2");

const { S3_ENDPOINT, BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } =
  process.env;

const spacesEndpoint = new aws.Endpoint(S3_ENDPOINT);
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const uploadAvatar = multer({
  storage: multerS3({
    s3,
    bucket: BUCKET_NAME,
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldname: file.fieldname });
    },
    key: async (req, file, cb) => {
      const id = req.params.id;

      //Limpa o diretorio do avatar para salvar um novo
      await emptyS3Directory(BUCKET_NAME, "imagens/usuario/" + id + "/avatar/");

      //Joga o arquivo no bucket setado
      cb(null, "imagens/usuario/" + id + "/avatar/" + file.originalname);
    },
  }),
}).single("upload");

async function emptyS3Directory(bucket, dir) {
  const listParams = {
    Bucket: bucket,
    Prefix: dir,
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

  console.log(listedObjects);

  if (listedObjects.Contents.length === 0) return;

  const deleteParams = {
    Bucket: bucket,
    Delete: { Objects: [] },
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });

  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
}

module.exports = { uploadAvatar, s3 };
