import React, { useRef, useState, useEffect } from "react";
import { RefreshCcw, Send, Sparkles, ImageUp, X } from "lucide-react";

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [cameraMode, setCameraMode] = useState("front");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [cameraActive, setCameraActive] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
const zoomOptions = [0.5, 1, 2];


  useEffect(() => {
    if (cameraActive) checkCameraPermission();
    return () => stopCamera();
  }, [cameraMode, cameraActive]);

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
      setPermissionDenied(true);
    }
  };

  const startCamera = async () => {
    if (permissionDenied || hasPermission === false || !cameraActive) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: cameraMode === "front" ? "user" : "environment",
          zoom: zoomLevel // Áp dụng mức zoom
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
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

    // Đặt kích thước hình vuông
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvasRef.current.width = size;
    canvasRef.current.height = size;

    if (cameraMode === "front") {
      context.translate(size, 0);
      context.scale(-1, 1);
    }

    // Cắt ảnh lấy phần trung tâm
    const xOffset = (video.videoWidth - size) / 2;
    const yOffset = (video.videoHeight - size) / 2;
    context.drawImage(video, xOffset, yOffset, size, size, 0, 0, size, size);

    setCapturedMedia({
      type: "image",
      data: canvasRef.current.toDataURL("image/png"),
    });
    setCameraActive(false);
  };

  const handleDelete = () => {
    setCapturedMedia(null);
    setSelectedFile(null);
    setCaption("");
    setCameraActive(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({ type: "image", data: reader.result });
        setCameraActive(false);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      const videoUrl = URL.createObjectURL(file);
      setSelectedFile({ type: "video", data: videoUrl });
      setCameraActive(false);
    }
  };
  

  const handleSubmit = () => {
    console.log("File: ", selectedFile || capturedMedia);
    console.log("Caption: ", caption);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen min-h-screen inset-0 bg-locket -z-50">
      <h1 className="text-3xl mb-6 font-semibold">Locket Upload</h1>
      <div className="relative w-full max-w-md aspect-square bg-gray-800 rounded-[60px] overflow-hidden">
        {!selectedFile && cameraActive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${
              cameraMode === "front" ? "scale-x-[-1]" : ""
            }`}
          />
        )}
        {selectedFile && selectedFile.type === "video" && (
          <div className="relative w-full h-full overflow-hidden">
            <video
              src={selectedFile.data}
              autoPlay
              loop
              playsInline
              controls
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        {selectedFile && selectedFile.type === "image" && (
          <img
            src={selectedFile.data}
            alt="Selected File"
            className="w-full h-full object-cover  select-none no-save"
          />
        )}
        {capturedMedia && capturedMedia.type === "image" && (
          <img
            src={capturedMedia.data}
            alt="Captured"
            className="w-full h-full object-cover  select-none no-save"
          />
        )}
        <div className="absolute top-4 right-4 flex gap-2 bg-white/60 p-2 rounded-lg">
  {zoomOptions.map((zoom) => (
    <button
      key={zoom}
      onClick={() => setZoomLevel(zoom)}
      className={`px-3 py-1 rounded-md text-black ${
        zoomLevel === zoom ? "bg-black text-white" : "bg-white"
      }`}
    >
      {zoom}x
    </button>
  ))}
</div>

{(capturedMedia || selectedFile) && (
  <textarea
    value={caption}
    onChange={(e) => setCaption(e.target.value)}
    placeholder="Nhập tin nhắn..."
    rows="1"
    className="absolute text-white font-semibold bottom-4 left-1/2 transform backdrop-blur-2xl -translate-x-1/2 bg-white/50 rounded-4xl p-2 text-md outline-none max-w-[90%] w-auto resize-none overflow-hidden transition-all"
    style={{ width: `${Math.max(100, caption.length * 10)}px` }}
  />
)}

      </div>

      <div className="flex gap-4 w-full h-40 max-w-md justify-evenly items-center">
        {capturedMedia || selectedFile ? (
          <>
            <button className="cursor-pointer" onClick={handleDelete}>
              <X size={35} />
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-circle w-22 h-22 backdrop-blur-md transition-opacity duration-300 outline-base-300 bg-white/98 mx-4"
            >
              <Send size={40} />
            </button>
            <button>
              <Sparkles size={35} />
            </button>
          </>
        ) : (
          <>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <ImageUp size={35} />
            </label>
            <button
              onClick={handleCapturePhoto}
              className="rounded-full w-18 h-18 bg-base-300 mx-4 outline-5 outline-offset-3 outline-accent"
            ></button>
            <button
              className="cursor-pointer"
              onClick={() =>
                setCameraMode(cameraMode === "front" ? "back" : "front")
              }
            >
              {" "}
              <RefreshCcw
                size={35}
                className="transform rotate-[-30deg]"
              />{" "}
            </button>
          </>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
