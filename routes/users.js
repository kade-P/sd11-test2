import express from "express";
import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import StartSpeechSynthesisTaskCommand from "@aws-sdk/client-polly";
// import { s3Client } from "../libs/s3Client.js";
// import { s3Client } from "@aws-sdk/client-s3";

import { S3Client } from "@aws-sdk/client-s3";
// Set the AWS Region.
const REGION = "ap-northeast-1";
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION });

const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("ルートだよ");
});

/* bucketのリストを取得する */
router.get("/buckets", async function (req, res, next) {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log("Success", data.Buckets);
    res.send(data.Buckets);
  } catch (err) {
    console.log("Error", err);
  }
});

router.get("/storage/:bucket/file/:filename", async function (req, res, next) {

  try {
    const bucketParams = { Bucket: req.params.bucket, Key: req.params.filename }
    const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
    console.log("Success. Object deleted.", data);
  } catch (err) {
    console.log("Error", err);
  }
});

router.get("/tts/save-to-s3/", async function (req, res, next) {
  try {
    const bucketName = "km-sd11";
    const txt = req.body.txt;
    // const txt = req.body.text;
    const params = {
      OutputFormat: "mp3",
      OutputS3BucketName: "km-sd11",
      Text: txt,
      TextType: "text",
      VoiceId: "Takumi",
      SampleRate: "24000",
    };
    await pollyClient.send(new StartSpeechSynthesisTaskCommand(params));
    console.log("mp3保存したよ.", "");
  } catch (err) {
    console.log("Error", err);
  }
});

export default router;
