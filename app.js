const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let model;

// Load the model
cocoSsd.load().then((loadedModel) => {
  model = loadedModel;
  startVideo();
});

// Start the webcam stream
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      // Begin object detection when the video starts playing
      video.onloadeddata = () => {
        detectFrame();
      };
    })
    .catch((error) => {
      console.error('Error accessing the webcam:', error);
    });
}

// Detect objects in the current video frame
function detectFrame() {
  model.detect(video).then((predictions) => {
    renderPredictions(predictions);
    requestAnimationFrame(detectFrame);
  });
}

// Render bounding boxes and labels on the canvas
function renderPredictions(predictions) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction.bbox;
    context.strokeStyle = '#00FFFF';
    context.lineWidth = 2;
    context.strokeRect(x, y, width, height);

    context.fillStyle = '#00FFFF';
    context.font = '16px sans-serif';
    context.fillText(
      `${prediction.class} (${(prediction.score * 100).toFixed(1)}%)`,
      x,
      y > 10 ? y - 5 : 10
    );
  });
}