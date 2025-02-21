
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => console.error("Camera access denied:", err));

// Load the TensorFlow.js model
async function loadModel() {
  return await cocoSsd.load();
}

// Capture Image and Run Object Detection
async function captureAndDetect() {
  // Draw video frame to canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Load the model
  const model = await loadModel();

  // Perform object detection
  const predictions = await model.detect(canvas);

  console.log("Predictions:", predictions);

  // Draw boxes around detected objects
  predictions.forEach(prediction => {
    ctx.beginPath();
    ctx.rect(...prediction.bbox);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
    ctx.stroke();
    ctx.fillText(prediction.class, prediction.bbox[0], prediction.bbox[1] - 5);
  });
}
