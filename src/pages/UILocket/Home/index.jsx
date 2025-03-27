import React, { useRef, useState, useEffect } from "react";
import { Camera, RotateCw, Send, AlertTriangle } from "lucide-react";

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [isRecording, setIsRecording] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [chunks, setChunks] = useState([]);
  const [isPermissionRequested, setIsPermissionRequested] = useState(false);
  
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setPermissionDenied(false);
    } catch (error) {
      console.error("Không thể truy cập camera", error);
      setPermissionDenied(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    const video = videoRef.current;

    canvasRef.current.width = video.videoWidth;
    canvasRef.current.height = video.videoHeight;
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const imageData = canvasRef.current.toDataURL("image/png");
    setCapturedMedia({ type: "image", data: imageData });
    stopCamera();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      {permissionDenied && (
        <div className="text-white text-center p-4 bg-red-500 rounded-md">
          <AlertTriangle size={24} className="inline-block mr-2" />
          Vui lòng cấp quyền camera trong cài đặt trình duyệt!
        </div>
      )}

      <div className="relative w-full max-w-md aspect-square bg-gray-800 rounded-lg overflow-hidden">
        {capturedMedia ? (
          <img src={capturedMedia.data} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        )}
      </div>

      <button onClick={handleCapturePhoto} className="btn btn-accent text-white mt-4">
        <Camera size={30} /> Chụp ảnh
      </button>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;