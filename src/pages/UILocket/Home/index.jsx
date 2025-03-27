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
} from "lucide-react";

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [cameraMode, setCameraMode] = useState("front"); // "front" = Front camera, "back" = Back camera
  const [isRecording, setIsRecording] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const chunksRef = useRef([]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [cameraMode]);

  const startCamera = async () => {
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
    stopCamera();
  };

  const toggleCamera = () => {
    setCameraMode((prev) => (prev === "front" ? "back" : "front"));
  };
  const handleRetake = () => {
    setCapturedMedia(null);
    startCamera(); // Mở lại camera ngay sau khi xóa media
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      {permissionDenied && (
        <div className="text-white text-center p-4 bg-red-500 rounded-md">
          <AlertTriangle size={24} className="inline-block mr-2" />
          Please allow camera access in your browser settings!
        </div>
      )}

      <div className="relative w-full max-w-md aspect-square bg-gray-800 rounded-lg overflow-hidden">
        {capturedMedia ? (
          capturedMedia.type === "image" ? (
            <img
              src={capturedMedia.data}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={capturedMedia.data}
              controls
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${
              cameraMode === "front" ? "scale-x-[-1]" : ""
            }`}
          />
        )}
      </div>

      <div className="flex gap-10 mt-4 max-w-md items-center content-between">
        {capturedMedia ? (
          <>
            <button onClick={handleRetake} className="btn btn-secondary">
              <Undo2 size={24} /> Retake
            </button>

            <button
              onClick={handleCapturePhoto}
              className="btn btn-circle w-24 h-24 btn-primary"
            >
              <Camera size={45} />
            </button>

            <button onClick={toggleCamera} className="btn btn-primary">
              <Sparkles size={24} /> Add Filter
            </button>
          </>
        ) : (
          <>
            <button onClick={toggleCamera} className="btn btn-primary">
              <FileUp size={24} /> Choose File
            </button>

            <button
              onClick={handleCapturePhoto}
              className="btn btn-circle w-24 h-24 btn-primary"
            >
              <Camera size={45} />
            </button>

            <button onClick={toggleCamera} className="btn btn-primary">
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
