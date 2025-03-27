import React, { useRef, useState, useEffect } from "react";
import { Camera, RotateCw, AlertTriangle } from "lucide-react";

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [isRecording, setIsRecording] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const chunksRef = useRef([]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPermissionDenied(false);
    } catch (error) {
      console.error("Không thể truy cập camera", error);
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

    if (facingMode === "user") {
      context.translate(video.videoWidth, 0);
      context.scale(-1, 1);
    }

    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const imageData = canvasRef.current.toDataURL("image/png");

    setCapturedMedia({ type: "image", data: imageData });
    stopCamera();
  };

  const handleStartRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
    const stream = videoRef.current.srcObject;
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/mp4" });
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);

    mediaRecorder.ondataavailable = (event) => {
      console.log("Dữ liệu chunk:", event.data.size);
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    

    mediaRecorder.onstop = async () => {
      console.log("Tổng số chunk:", chunksRef.current.length);
    
      if (chunksRef.current.length === 0) {
        console.error("Lỗi: Không có dữ liệu video!");
        return;
      }
    
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
    
      if (blob.size === 0) {
        console.error("Lỗi: Video rỗng, không thể phát!");
        return;
      }
    
      // Chuyển video Blob thành Object URL để xử lý
      const originalVideoURL = URL.createObjectURL(blob);
      
      // Tạo một video ẩn để xử lý
      const video = document.createElement("video");
      video.src = originalVideoURL;
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = "anonymous"; // Nếu cần tránh lỗi CORS
    
      await new Promise((resolve) => (video.onloadeddata = resolve));
    
      // Tạo Canvas để vẽ khung hình lật ngược
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
    
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    
      // Ghi lại video đã lật
      const newChunks = [];
      const newStream = canvas.captureStream();
      const newRecorder = new MediaRecorder(newStream, { mimeType: "video/webm" });
    
      newRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          newChunks.push(event.data);
        }
      };
    
      newRecorder.start();
    
      // Phát video gốc và vẽ khung hình lật lên Canvas
      video.play();
      const drawFrame = () => {
        if (!video.paused && !video.ended) {
          ctx.save();
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1); // Lật ngang video
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.restore();
          requestAnimationFrame(drawFrame);
        }
      };
      drawFrame();
    
      await new Promise((resolve) => setTimeout(resolve, video.duration * 1000));
    
      newRecorder.stop();
    
      await new Promise((resolve) => (newRecorder.onstop = resolve));
    
      const flippedBlob = new Blob(newChunks, { type: "video/webm" });
      const flippedVideoURL = URL.createObjectURL(flippedBlob);
    
      setCapturedMedia({ type: "video", data: flippedVideoURL });
    
      chunksRef.current = []; // Reset chunks
      stopCamera();
    };
    
    
    
    

    mediaRecorder.start();

    setTimeout(() => {
      if (mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        setIsRecording(false);
      }
    }, 10000);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      {permissionDenied && (
        <div className="text-white text-center p-4 bg-red-500 rounded-md">
          <AlertTriangle size={24} className="inline-block mr-2" />
          Vui lòng cấp quyền camera trong cài đặt trình duyệt!
        </div>
      )}

      <div className="relative w-full max-w-md aspect-square bg-gray-800 rounded-lg overflow-hidden">
        {capturedMedia ? (
          capturedMedia.type === "image" ? (
            <img src={capturedMedia.data} alt="Captured" className="w-full h-full object-cover" />
          ) : (
            <video src={capturedMedia.data} controls className="w-full h-full object-cover" />
          )
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
          />
        )}
      </div>

      <div className="flex gap-4 mt-4">
        {capturedMedia ? (
          <button onClick={() => setCapturedMedia(null)} className="btn btn-secondary">
            <RotateCw size={24} /> Chụp lại
          </button>
        ) : (
          <>
            <button
              onMouseDown={handleStartRecording}
              onMouseUp={handleStopRecording}
              onTouchStart={handleStartRecording}
              onTouchEnd={handleStopRecording}
              onClick={handleCapturePhoto}
              className={`btn ${isRecording ? "btn-error" : "btn-accent"} text-white`}
            >
              <Camera size={30} />
              {isRecording ? "Đang quay..." : "Chụp ảnh / Giữ để quay"}
            </button>
            <button onClick={toggleCamera} className="btn btn-primary">
              <RotateCw size={24} /> Đổi camera
            </button>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
