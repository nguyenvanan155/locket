import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthLocket";
import * as utils from "../utils";
import * as lockerService from "../services/locketService";
import { Link } from "react-router-dom";

const Upload = () => {
    const { user, setUser } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [isShowModal, setIsShowModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileRef = useRef(null);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleSelectFile = (e) => {
        const { files } = e.target;
        if (files?.length) {
            const objectUrl = URL.createObjectURL(files[0]);
            setFile(files[0]);
            setPreviewUrl(objectUrl);
        }
    };

    const handleUploadFile = () => {
        if (file) {
            setIsUploading(true);
            lockerService
                .uploadMedia(file, caption, showToastPleaseWait)
                .then(() => {
                    setPreviewUrl("");
                    setCaption("");
                    setIsUploading(false);
                    toast.success("Upload successfully");
                })
                .catch((error) => {
                    setIsUploading(false);
                    toast.error("Upload failed");
                });
        }
    };

    const showToastPleaseWait = () => {
        toast.info("Please wait, the request may take longer.");
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                {user ? (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Upload Image or Video</h2>
                        <input
                            type="text"
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Enter title for your post"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                        <div className="border-dashed border-2 p-6 flex justify-center items-center cursor-pointer"
                            onClick={() => fileRef.current.click()}
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="max-h-40 object-contain" />
                            ) : (
                                <p className="text-gray-500">Click to select file</p>
                            )}
                        </div>
                        <input type="file" ref={fileRef} className="hidden" onChange={handleSelectFile} accept="image/*,video/*" />
                        <div className="flex justify-between mt-4">
                            <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setPreviewUrl("")}>Cancel</button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50" 
                                disabled={!previewUrl || !caption || isUploading} 
                                onClick={handleUploadFile}
                            >
                                {isUploading ? "Uploading..." : "Submit"}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <h3 className="text-lg">Please login to upload</h3>
                        <Link to="loginv2" className="bg-blue-500 text-white px-4 py-2 rounded mt-4" >Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Upload;