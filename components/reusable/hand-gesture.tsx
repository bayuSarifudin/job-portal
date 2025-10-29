"use client";

import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  HandLandmarker,
} from "@mediapipe/tasks-vision";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  form: UseFormReturn<any>;
  setOpen: any;
}

export default function HandGesture({ form, setOpen }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);

  const [message, setMessage] = useState("Mengakses kamera...");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [gestureLocked, setGestureLocked] = useState(false);
  const isOne = useRef(false);
  const isTwo = useRef(false);


  const animationFrameRef = useRef<number | null>(null);
  const lastGestureTime = useRef(0);

  // ✅ Camera Init
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const video = videoRef.current;
        if (!video) return;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });

        video.srcObject = stream;
        await video.play().catch(() => { });
        if (video.readyState >= 1) {
          startModel();
        } else {
          video.addEventListener("loadedmetadata", startModel, { once: true });
        }
      } catch (err) {
        console.error(err);
        setMessage("Izin kamera diblokir");
      }
    };

    setupCamera();
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  // ✅ Init model
  async function startModel() {
    setMessage("Memuat model...");
    const vision = await FilesetResolver.forVisionTasks("/mediapipe/wasm");
    const handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "/models/hand_landmarker.task",
      },
      runningMode: "VIDEO",
      numHands: 1,
    });

    handLandmarkerRef.current = handLandmarker;
    setMessage("Model siap. Tunjukkan gesture kamu 👋");
    startDetection();
  }

  // ✅ Detection Loop
  function startDetection() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d")!;
    const detect = async () => {
      if (
        !handLandmarkerRef.current ||
        video.readyState < 2 ||
        video.videoWidth === 0
      ) {
        animationFrameRef.current = requestAnimationFrame(detect);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      const results = await handLandmarkerRef.current.detectForVideo(
        video,
        performance.now()
      );

      if (results.landmarks?.length) {
        const landmarks = results.landmarks[0];
        drawLandmarks(ctx, landmarks);
        handleGesture(landmarks);
      } else {
        setMessage("Tidak ada tangan terdeteksi");
        setGestureLocked(false);
      }

      animationFrameRef.current = requestAnimationFrame(detect);
    };

    detect();
  }

  function drawLandmarks(ctx: CanvasRenderingContext2D, lands: any[]) {
    ctx.fillStyle = "red";
    lands.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x * ctx.canvas.width, p.y * ctx.canvas.height, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  function handleGesture(landmarks: any[]) {
    const gesture = detectGesture(landmarks);
    if (!gesture) return;

    setMessage(`Gesture: ${gesture}`);

    const now = Date.now();
    if (gesture === "three" && !gestureLocked && !isCountingDown && now - lastGestureTime.current > 2000) {
      setGestureLocked(true);
      startCountdown();
      lastGestureTime.current = now;
    }
  }

  // ✅ Gesture Logic (1,2,3)
  function detectGesture(lands: any[]) {
    const fingers = {
      index: lands[8].y < lands[6].y,
      middle: lands[12].y < lands[10].y,
      ring: lands[16].y < lands[14].y,
      pinky: lands[20].y < lands[18].y,
    };

    const count = Object.values(fingers).filter(Boolean).length;

    if (count === 1 && fingers.index) {
      isOne.current = true;
      return "one";
    };
    if (count === 2 && fingers.index && fingers.middle && isOne.current && !isTwo.current) {
      isTwo.current = true;
      return "two";
    };
    if (count === 3 && fingers.index && fingers.middle && fingers.ring && isTwo.current) {
      isOne.current = false;
      isTwo.current = false;
      return "three";
    };

    return null;
  }

  // ✅ Countdown to snapshot
  function startCountdown() {
    setIsCountingDown(true);
    let count = 3;
    setCountdown(3);

    const interval = setInterval(() => {
      count--;
      setCountdown(count);

      if (count <= 0) {
        clearInterval(interval);
        setIsCountingDown(false);
        setCountdown(null);
        takeSnapshot();
        setGestureLocked(false);
      }
    }, 1000);
  }

  // ✅ Capture → setValue ke form
  function takeSnapshot() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);

    const base64 = canvas.toDataURL("image/png");

    form.setValue("photo_profile", base64);
    toast.success("Foto berhasil ditangkap & disimpan ke form!");
    setOpen(false);
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 text-white rounded-lg gap-2">
      <div className="relative">
        <video ref={videoRef} muted className="rounded-lg" />
        <canvas ref={canvasRef} className="absolute inset-0 rounded-lg w-full" />
        {countdown !== null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-m font-bold bg-black/50">
            Capturing photo in <span className="text-[40px] font-bold">{countdown}</span>
          </div>
        )}
      </div>
      <p className="text-lg">{message}</p>
    </div>
  );
}
