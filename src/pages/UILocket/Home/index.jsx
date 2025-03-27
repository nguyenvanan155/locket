import React, { useRef, useState, useEffect } from "react";
import {
  Camera,
  RotateCw,
  AlertTriangle,
  Undo2,
  CircleDot,
  FileUp,
  RefreshCcw,
  Sparkles,
  Send,
  Trash2,
  Upload
} from "lucide-react";

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [cameraMode, setCameraMode] = useState("front");
  const [isRecording, setIsRecording] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  useEffect(() => {
    if (!permissionDenied) {
      startCamera();
    }
    return () => stopCamera();
  }, [cameraMode, permissionDenied]);

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
      result.onchange = () => {
        setHasPermission(result.state === "granted");
      };
    } catch (error) {
      console.error("Permission API not supported", error);
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
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="relative w-full max-w-md aspect-square bg-gray-800 rounded-lg overflow-hidden border-4 border-blue-500" style={{ borderImage: `linear-gradient(to right, #00f ${recordingProgress}%, transparent ${recordingProgress}%) 1` }}>
        {capturedMedia ? (
          capturedMedia.type === "image" ? (
            <img src={capturedMedia.data} alt="Captured" className="w-full h-full object-cover" />
          ) : (
            <video src={capturedMedia.data} controls className="w-full h-full object-cover" />
          )
        ) : (
          <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${cameraMode === "front" ? "scale-x-[-1]" : ""}`} />
        )}
      </div>

      <div className="flex gap-4 mt-4 max-w-md items-center content-between">
        {capturedMedia ? (
          <>
            <button onClick={handleDelete} className="btn btn-danger">
              <Trash2 size={24} /> Delete
            </button>
            <button className="btn btn-success">
              <Send size={24} /> Send
            </button>
            <button className="btn btn-primary">
              <Sparkles size={24} /> Add Effect
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary">
              <Upload size={24} /> Upload File
            </button>
            <button onMouseDown={startRecording} onMouseUp={stopRecording} onClick={handleCapturePhoto} className="btn btn-circle w-24 h-24 btn-primary">
              <Camera size={45} />
            </button>
            <button onClick={() => setCameraMode(cameraMode === "front" ? "back" : "front")} className="btn btn-secondary">
              <RefreshCcw size={24} /> Switch Camera
            </button>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
