import React, { useRef, useState, useEffect } from "react";
import {
  Camera,
  RefreshCcw,
  Trash2,
  Send,
  Sparkles,
  Image
} from "lucide-react";

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [cameraMode, setCameraMode] = useState("front");
  const [isRecording, setIsRecording] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [pressStartTime, setPressStartTime] = useState(null);

  useEffect(() => {
    checkCameraPermission();
    return () => stopCamera();
  }, [cameraMode]);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: "camera" });
      if (result.state === "granted") {
        setHasPermission(true);
        startCamera();
      } else if (result.state === "denied") {
        setHasPermission(false);
        setPermissionDenied(true);
      }
    } catch (error) {
      console.error("Permission API not supported", error);
      setPermissionDenied(true);
    }
  };

  const startCamera = async () => {
    if (permissionDenied || hasPermission === false) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraMode === "front" ? "user" : "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPermissionDenied(false);
    } catch (error) {
      console.error("Cannot access the camera", error);
      setPermissionDenied(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    const video = videoRef.current;

    canvasRef.current.width = video.videoWidth;
    canvasRef.current.height = video.videoHeight;

    if (cameraMode === "front") {
      context.translate(video.videoWidth, 0);
      context.scale(-1, 1);
    }

    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const imageData = canvasRef.current.toDataURL("image/png");

    setCapturedMedia({ type: "image", data: imageData });
  };

  const startRecording = () => {
    if (!videoRef.current) return;
    chunksRef.current = [];
    const stream = videoRef.current.srcObject;
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(blob);
      setCapturedMedia({ type: "video", data: videoUrl });
      setRecordingProgress(0);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    let progress = 0;
    timerRef.current = setInterval(() => {
      progress += 10;
      setRecordingProgress(progress);
      if (progress >= 100) stopRecording();
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    clearInterval(timerRef.current);
  };

  const handleDelete = () => {
    setCapturedMedia(null);
    startCamera();
    setSelectedFile(null);
    setCaption("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedFile({ type: "image", data: reader.result });
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        const videoUrl = URL.createObjectURL(file);
        setSelectedFile({ type: "video", data: videoUrl });
      } else {
        alert('Please select an image or video file.');
      }
    }
  };

  const handleSubmit = () => {
    console.log("File: ", selectedFile);
    console.log("Caption: ", caption);
    // Handle submission (e.g., sending to API)
  };

  const handlePressStart = () => {
    setPressStartTime(Date.now());
  };

  const handlePressEnd = () => {
    const pressDuration = Date.now() - pressStartTime;
    if (pressDuration < 500) {
      // Short press, capture photo
      handleCapturePhoto();
    } else {
      // Long press, start/stop recording video
      if (!isRecording) {
        startRecording();
      } else {
        stopRecording();
      }
    }
    setPressStartTime(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl -mt-20 mb-6">Locket Upload</h1>
      <div className="relative w-full max-w-md aspect-square bg-gray-800 rounded-[60px] overflow-hidden box-border border-4 border-base">
        {selectedFile ? (
          selectedFile.type === "image" ? (
            <img src={selectedFile.data} alt="Selected File" className="w-full h-full object-cover" />
          ) : (
            <video src={selectedFile.data} controls className="w-full h-full object-cover" />
          )
        ) : capturedMedia ? (
          capturedMedia.type === "image" ? (
            <img src={capturedMedia.data} alt="Captured" className="w-full h-full object-cover" />
          ) : (
            <video src={capturedMedia.data} controls className="w-full h-full object-cover" />
          )
        ) : (
          <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${cameraMode === "front" ? "scale-x-[-1]" : ""}`} />
        )}
        <div className="absolute bottom-0 w-full p-4">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter caption..."
            className="w-auto p-2 rounded-lg text-white bg-gray-700 overflow-hidden whitespace-nowrap text-ellipsis"
          />
        </div>
      </div>

      <div className="flex gap-4 w-full mt-4 max-w-md justify-evenly items-center">
        {capturedMedia || selectedFile ? (
          <>
            <button onClick={handleDelete}>
              <Trash2 size={35} />
            </button>
            <button onClick={handleSubmit} className="btn btn-circle w-20 h-20 btn-primary mx-4 pt-1.5 pr-1">
              <Send size={45} />
            </button>
            <button>
              <Sparkles size={35} />
            </button>
          </>
        ) : (
          <>
            <div>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Image size={35} />
              </label>
            </div>
            <button
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              className="btn btn-circle w-20 h-20 btn-primary mx-4"
            >
              <Camera size={45} />
            </button>
            <button onClick={() => setCameraMode(cameraMode === "front" ? "back" : "front")}>
              <RefreshCcw size={35} />
            </button>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
