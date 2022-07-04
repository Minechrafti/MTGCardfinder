/**
 * @param {detection} object -> result from AWS Text detection
 */
export const extractLines = (detection) => {
  const allDetections = detection.TextDetections;

  return allDetections
    .filter((detection) => detection.Type === "LINE")
    .map((detection) => detection.DetectedText);
};
