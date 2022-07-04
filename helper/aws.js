import {
  RekognitionClient,
  DetectTextCommand,
} from "@aws-sdk/client-rekognition";

const rekognition = new RekognitionClient({
  region: "us-west-2",
  credentials: {
    accessKeyId: "AKIAUE5KQIMYNCHYJZFI",
    secretAccessKey: "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",
  },
});

/**
 * @param {Buffer} buffer
 * @param {Function?} resultSelector
 */
const detectText = (buffer, resultSelector) =>
  new Promise((resolve, reject) => {
    const params = {
      Image: { Bytes: buffer },
    };

    const command = new DetectTextCommand(params);
    rekognition.send(command).then(
      (data) => {
        if (resultSelector) {
          return resolve(resultSelector(data));
        }

        resolve(data);
      },
      (error) => {
        return reject(error);
      }
    );
  });

export default {
  detectText,
};
