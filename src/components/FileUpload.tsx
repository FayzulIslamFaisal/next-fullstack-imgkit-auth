"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { on } from "events";
import { useRef, useState } from "react";
interface FileUploadProps {
    onSuccess: (res: any) => void;
    onProgress: (progress: number) => void;
    fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
    // const [progress, setProgress] = useState(0);

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please select a video file.");
            }
            if (file.size > 100 * 1024 * 1024) {
                setError("Video size should be less than 100MB.");
            }
        } else if (fileType === "image") {
            if (!file.type.startsWith("image/")) {
                setError("Please select an image file.");
            }
            if (file.size > 10 * 1024 * 1024) {
                setError("Image size should be less than 10MB.");
            }
        }
        return true;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            validateFile(file);
            setUploading(true);
            uploadFile(file);
        }else {
            setError("Please select a file.");
        }
        try {
           const authRes = await fetch("/api/auth/imagekit-auth");
           const auth = await authRes.json();
           const res =await upload({
                file,
                fileName: file.name, 
                publicKey:process.env.NEXTAUTH_PUBLIC_PUBLIC_KEY as string,
                signature:auth.signature,
                expire:auth.expire,
                token:auth.token,
                
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const percent = Math.round((event.loaded / event.total) * 100);
                        onProgress(percent);
                        
                    }
                    
                },
                
           });
           onSuccess(res);
        } catch (error) {
            console.error("Error uploading file:", error);
        }finally {
            setUploading(false);
        }
    };

    return (
        <>
            <input 
                accept="fileType === 'image' ? 'image/*' : 'video/*'" 
                type="file"
                onChange={handleFileChange}
            />
            {
                uploading && (
                    <div>
                        <p>Uploading...</p>
                    </div>
                )
            }
            {/* <button type="button" onClick={handleUpload}>
                Upload file
            </button>
            <br />
            Upload progress: <progress value={progress} max={100}></progress> */}
        </>
    );
};

export default FileUpload;