const video = document.getElementById("video");
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const predictionsDiv = document.getElementById("predictions");

        // Access the camera
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
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
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Load the model
            const model = await loadModel();

            // Perform object detection
            const predictions = await model.detect(canvas);

            console.log("Predictions:", predictions);

            // Clear previous predictions
            predictionsDiv.innerHTML = "<h3>Detected Objects:</h3>";

            // Draw boxes and display predictions
            predictions.forEach(prediction => {
                ctx.beginPath();
                ctx.rect(...prediction.bbox);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "red";
                ctx.fillStyle = "red";
                ctx.stroke();
                ctx.fillText(prediction.class, prediction.bbox[0], prediction.bbox[1] - 5);

                // Append the detected object to the div
                const p = document.createElement("p");
                p.textContent = `Detected: ${prediction.class} (Confidence: ${(prediction.score * 100).toFixed(2)}%)`;
                predictionsDiv.appendChild(p);
            });
        }