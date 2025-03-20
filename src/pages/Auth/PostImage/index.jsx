import React, { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./cropImage.js";
import {
  ZoomIn,
  ZoomOut,
  FolderOpen,
  Image,
  RotateCcw,
  Send,
  Scissors,
  Palette,
  Pencil,
} from "lucide-react";
import { showToast } from "../../../components/Toast/index.jsx";
import * as lockerService from "../../../services/locketService.js";
import * as utils from "../../../utils";

const Post = () => {
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [croppedImage, setCroppedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const fileRef = useRef(null);
  const [colorTop, setColorTop] = useState("#000000"); // Mặc định là đen
  const [colorBottom, setColorBottom] = useState("#000000");
  const [colorText, setColorText] = useState("#FFFFFF");

  const handleColorChange = (setter, value, otherColor, setOtherColor) => {
    setter(value);
    if (!otherColor || otherColor === "rgba(0, 0, 0, 0.5)") {
      setOtherColor(value);
    }
  };

  const handleTriggerUploadFile = () => fileRef.current?.click();

  const handleSelectFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      showToast("success", "Tải ảnh lên thành công!");
    }
  };

  const handleCropComplete = useCallback(
    async (_, croppedAreaPixels) => {
      try {
        const croppedFile = await getCroppedImg(previewUrl, croppedAreaPixels);
        setCroppedImage(URL.createObjectURL(croppedFile)); // Hiển thị preview
        setFile(croppedFile); // ✅ Lưu file để gửi lên server
      } catch (e) {
        console.error(e);
      }
    },
    [previewUrl]
  );

  const handleUploadFile = async () => {
    if (!file) {
      showToast("warning", "No file selected!");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();

    // Xác định loại file và append đúng key
    if (file.type.includes("image")) {
      formData.append("images", file); // key phải đúng với backend
    } else if (file.type.includes("video")) {
      formData.append("videos", file); // key phải đúng với backend
    } else {
      showToast("warning", "File không hợp lệ!");
      return;
    }

    formData.append("idToken", utils.getAuthToken());
    formData.append("localId", utils.getLocalId());

    formData.append("caption", caption);
    // Gửi option dưới dạng JSON string
    const options = {
      isGif: "false",
      text_color: colorText || "#000000E6",
      colors: `${colorTop || "#00FA9A"},${
        colorBottom || "#1E90FF"
      },#FF69B4,#FF69B4`,
    };
    formData.append("options", JSON.stringify(options));

    console.log("🛠️ FormData gửi đi:", Object.fromEntries(formData.entries())); // Kiểm tra dữ liệu gửi đi

    try {
      showToast("info", "Đang tạo bài viết!");
      const res = await lockerService.uploadMedia(formData);

      setPreviewUrl("");
      setCaption("");
      setIsUploading(false);

      showToast("success", "Đăng bài viết thành công!");
    } catch (error) {
      let message = error?.response?.data?.message || "Đăng bài viết thất bại!";
      showToast("success", message);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-screen p-6 bg-base-200">
      <div className="h-16"></div>
      <div className="p-6 rounded-lg shadow-md w-full max-w-md bg-base-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold mb-4">Upload Image</h2>
          <div
            className="border-2 border-base-content border-dashed rounded-md p-4 cursor-pointer input-ghost flex items-center justify-center gap-2"
            onClick={handleTriggerUploadFile}
          >
            <FolderOpen size={20} className="" />
            <p className="">Click to Upload Image</p>
            <input
              type="file"
              ref={fileRef}
              onChange={handleSelectFile}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold mb-4">Crop & Edit</h2>
          <div className="relative w-full max-w-[400px] aspect-square mx-auto border border-base-content overflow-hidden flex items-center justify-center">
            {previewUrl ? (
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                cropShape="rect"
                showGrid
              />
            ) : (
              <div className="flex flex-col items-center justify-center ">
                <Scissors size={80} />
                <p className="mt-2 text-sm">Chưa có ảnh</p>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <button
              className="p-2 rounded btn"
              onClick={() => setZoom(zoom - 0.1)}
            >
              <ZoomOut size={20} />
            </button>
            <button
              className="p-2 rounded btn"
              onClick={() => setZoom(zoom + 0.1)}
            >
              <ZoomIn size={20} />
            </button>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold mb-4">Preview Post</h2>
          <div className="relative w-full max-w-[400px] aspect-square border border-base-content rounded-[40px] mb-4 overflow-hidden flex items-center justify-center disable-select">
            {croppedImage ? (
              <>
                <img
                  src={croppedImage}
                  alt="Cropped"
                  className="w-full h-full object-cover rounded-[40px]"
                />
                {caption.trim() && (
                  <div
                    className="absolute font-semibold bottom-4 left-1/2 transform -translate-x-1/2 text-center px-3 py-1.5 rounded-[30px]"
                    style={{
                      background: `linear-gradient(to bottom, ${colorTop}, ${colorBottom})`,
                      color: colorText,
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      padding: "8px 12px",
                    }}
                  >
                    {caption}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center">
                <Image size={80} />
                <p className="mt-2 text-sm">Chưa có ảnh</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold  mb-4">Customize Caption</h2>
          <p>Đang phát triển</p>
          {/* Chọn màu */}
          <div className="p-4 rounded-md shadow-md w-full max-w-md border">
            <h3 className="text-lg font-semibold  mb-3 text-left flex flex-row items-center">
              <Pencil size={20} className="mr-2" />
              Caption
            </h3>
            {/* Nhập Caption */}
            <input
              type="text"
              className="w-full text-gray-500 dark:text-gray-400 p-2 border border-base-content shadow-md rounded-md mb-4"
              placeholder="Thêm một tin nhắn"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <h3 className="text-lg font-semibold mb-3 text-left flex flex-row items-center">
              <Palette size={20} className="mr-1" /> Chọn màu
            </h3>
            <div className="flex justify-center items-center gap-4">
              <div className="flex flex-col items-center">
                <label className="mb-1">Màu trên</label>
                <input
                  type="color"
                  value={colorTop}
                  onChange={(e) =>
                    handleColorChange(
                      setColorTop,
                      e.target.value,
                      colorBottom,
                      setColorBottom
                    )
                  }
                  className="w-10 h-10 rounded-md border border-base-content p-1"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="mb-1">Màu dưới</label>
                <input
                  type="color"
                  value={colorBottom}
                  onChange={(e) =>
                    handleColorChange(
                      setColorBottom,
                      e.target.value,
                      colorTop,
                      setColorTop
                    )
                  }
                  className="w-10 h-10 rounded-md border border-base-content p-1"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="mb-1">Màu chữ</label>
                <input
                  type="color"
                  value={colorText}
                  onChange={(e) => setColorText(e.target.value)}
                  className="w-10 h-10 rounded-md border border-base-content p-1"
                />
              </div>
            </div>
            {/* Nút Reset */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  setColorTop("#000000");
                  setColorBottom("#000000");
                  setColorText("#FFFFFF");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-md shadow-md btn"
              >
                <RotateCcw size={20} /> Reset màu
              </button>
            </div>
          </div>
        </div>

        {/* Nút Gửi */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleUploadFile}
            className="flex items-center gap-2 btn btn-primary px-4 py-2 rounded-md shadow-md disabled:bg-gray-400"
            disabled={isUploading}
          >
            {isUploading ? "Đang tải lên..." : "Gửi bài"}
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
