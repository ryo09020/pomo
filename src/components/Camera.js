import React, { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import * as faceapi from 'face-api.js';

function Camera({ onSmileDetected }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isSmiling, setIsSmiling] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // モデルの読み込み
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        console.log("Face detection models loaded successfully");
        setIsModelLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  // 表情認識の処理
  const detectExpressions = useCallback(async () => {
    if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      try {
        const detections = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        if (detections) {
          const smile = detections.expressions.happy;
          const wasSmiling = isSmiling;  // 前の状態を保存
          setIsSmiling(smile > 0.7);

          // 笑顔を検出し、かつ前回は笑顔でなかった場合のみonSmileDetectedを呼び出す
          if (smile > 0.7 && !wasSmiling && onSmileDetected) {
            console.log("Smile detected, confidence:", smile);
            onSmileDetected();
          }
        }
      } catch (error) {
        console.error("Error during expression detection:", error);
      }
    }
  }, [isSmiling, onSmileDetected]);

  // 表情認識の定期実行
  useEffect(() => {
    let detectInterval;

    if (isEnabled && isModelLoaded) {
      console.log("Starting expression detection interval");
      detectInterval = setInterval(detectExpressions, 1000);
    }

    return () => {
      if (detectInterval) {
        console.log("Cleaning up expression detection interval");
        clearInterval(detectInterval);
      }
    };
  }, [isEnabled, isModelLoaded, detectExpressions]);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  };

  const handleCameraToggle = useCallback(() => {
    setIsEnabled(prev => !prev);
    if (!isEnabled) {
      console.log("Camera enabled");
    } else {
      console.log("Camera disabled");
    }
  }, [isEnabled]);

  return (
    <div className="relative">
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={handleCameraToggle}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            isEnabled 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isEnabled ? 'カメラを停止' : 'カメラを開始'}
        </button>
        {isEnabled && isSmiling && (
          <div className="text-green-500 font-medium animate-pulse">
            😊 笑顔を検出しました！
          </div>
        )}
      </div>

      <div className="relative">
        {isEnabled && (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              width={640}
              height={480}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="rounded-lg shadow-lg w-full"
              mirrored={true}
              onUserMediaError={(error) => {
                console.error("Webcam error:", error);
              }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
          </>
        )}

        {!isEnabled && (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-600">
              カメラをオンにして笑顔を検出します
            </p>
          </div>
        )}
      </div>

      {isEnabled && !isModelLoaded && (
        <div className="mt-2 text-center text-gray-600 animate-pulse">
          モデルを読み込んでいます...
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        笑顔を検出するとポモドーロが開始されます
      </div>
    </div>
  );
}

export default Camera;
