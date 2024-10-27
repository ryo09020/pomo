import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Pose } from '@mediapipe/pose';

// 角度を計算する関数（ヒップからショルダーへのベクトルと垂直線との有向角度）
function calculateAngle(a, b) {
  // ベクトル: ヒップからショルダーへ
  const vector = [b[0] - a[0], b[1] - a[1]];
  // 垂直上方向のベクトル（画面座標系ではY軸が下向きなので、上方向は-1）
  const vertical = [0, -1];

  // 有向角度を計算
  const angle = Math.atan2(
    vector[0] * vertical[1] - vector[1] * vertical[0],
    vector[0] * vertical[0] + vector[1] * vertical[1]
  );
  const angleDegrees = angle * (180 / Math.PI);

  return angleDegrees;
}

// ストレッチシーケンス管理クラス
class StretchSequence {
  constructor() {
    this.sequence = ['center', 'forward', 'center', 'backward'];
    this.holdTimes = { center: 2000, forward: 1000, backward: 1000 }; // 各ポジションのキープ時間（ミリ秒）
    this.currentStep = 0;
    this.positionStartTime = null;
    this.currentPosition = null;
    this.loopCount = 0;
    this.maxLoops = 2;
  }

  update(position) {
    const currentTime = Date.now();

    // ポジションが変わったらpositionStartTimeをリセット
    if (position !== this.currentPosition) {
      this.currentPosition = position;
      this.positionStartTime = currentTime;
    }

    if (this.positionStartTime === null) {
      this.positionStartTime = currentTime;
    }

    const requiredDuration = this.holdTimes[this.getNextPosition()];
    const elapsedTime = currentTime - this.positionStartTime;

    if (elapsedTime >= requiredDuration) {
      const expected = this.sequence[this.currentStep];
      console.log(`Expected position: ${expected}, Current position: ${this.currentPosition}`);
      if (this.currentPosition === expected) {
        console.log(`ステップ '${expected}' 完了`);
        this.currentStep += 1;
        if (this.currentStep >= this.sequence.length) {
          this.loopCount += 1;
          console.log(`ループ回数: ${this.loopCount}/${this.maxLoops}`);
          if (this.loopCount >= this.maxLoops) {
            console.log('ストレッチシーケンス完了！');
            return true; // シーケンス完了
          }
          this.currentStep = 0;
        }
        this.positionStartTime = null;
      }
    }

    return false;
  }

  getNextPosition() {
    return this.sequence[this.currentStep];
  }

  getRemainingLoops() {
    return this.maxLoops - this.loopCount;
  }

  getHoldTime() {
    return this.holdTimes[this.getNextPosition()];
  }

  reset() {
    this.currentStep = 0;
    this.positionStartTime = null;
    this.currentPosition = null;
    this.loopCount = 0;
  }

  getRemainingTime() {
    if (this.positionStartTime === null) return Math.ceil(this.getHoldTime() / 1000);
    const elapsedTime = Date.now() - this.positionStartTime;
    const remainingTime = Math.max(0, this.getHoldTime() - elapsedTime);
    return Math.ceil(remainingTime / 1000);
  }
}

function SequenceDisplay({ sequence, currentStep, remainingLoops }) {
  return (
    <div className="w-full px-4 py-2 bg-gray-100 rounded-lg mb-4">
      <p className="text-lg text-gray-700">指示に従って腰をストレッチしてください。</p>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-blue-600">シーケンス</h3>
        <div className="flex items-center justify-center mt-2">
          {sequence.map((step, idx) => (
            <React.Fragment key={idx}>
              {/* ステップアイコン */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full mr-2 mb-1 ${
                    idx < currentStep
                      ? 'bg-green-500 text-white'
                      : idx === currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {idx < currentStep ? '✔️' : idx + 1}
                </div>
                <span
                  className={`text-sm ${
                    idx === currentStep ? 'text-blue-700 font-semibold' : 'text-gray-600'
                  }`}
                >
                  {step}
                </span>
              </div>
              {/* ステップ間のライン */}
              {idx < sequence.length - 1 && (
                <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-4 text-lg text-yellow-600">
          残りループ数: <strong>{remainingLoops}</strong>
        </p>
      </div>
    </div>
  );
}

function WaistStretchModal({ onComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const stretchSeqRef = useRef(null); // StretchSequenceを参照として保持
  const [nextPosition, setNextPosition] = useState('');
  const [completed, setCompleted] = useState(false);
  const [countdown, setCountdown] = useState(0); // カウントダウンタイマー
  const [remainingLoops, setRemainingLoops] = useState(2);
  const [sequence, setSequence] = useState(['center', 'forward', 'center', 'backward']);
  const [isWaiting, setIsWaiting] = useState(false); // 待機中かどうか
  const animationFrameIdRef = useRef(null); // animationFrameIdを管理
  const initialAngleRef = useRef(null);
  const lastPositionRef = useRef('center');
  const [currentDetectedPosition, setCurrentDetectedPosition] = useState('center');
  const [currentAngle, setCurrentAngle] = useState(0);
  const [calibrating, setCalibrating] = useState(true); // キャリブレーション中かどうか
  const calibrationStartTimeRef = useRef(null);
  const [message, setMessage] = useState(
    '立ち上がって右を向き、左肩と左腰がカメラに映るようにしてください。'
  );

  useEffect(() => {
    let pose;
    let stream;
    let isMounted = true;

    // StretchSequenceのインスタンスを作成し、refに保存
    stretchSeqRef.current = new StretchSequence();
    setNextPosition(stretchSeqRef.current.getNextPosition());
    setRemainingLoops(stretchSeqRef.current.getRemainingLoops());

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        return new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            resolve();
          };
        });
      } catch (error) {
        console.error('カメラのアクセスに失敗しました:', error);
        onComplete(); // エラー時にもモーダルを閉じる
      }
    }

    function onResults(results) {
      if (!isMounted) return;

      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext('2d');
      const width = canvasElement.width;
      const height = canvasElement.height;

      // キャンバスをクリア
      canvasCtx.clearRect(0, 0, width, height);

      // 画像を描画（ミラーリング）
      canvasCtx.save();
      canvasCtx.scale(-1, 1);
      canvasCtx.translate(-width, 0);
      canvasCtx.drawImage(results.image, 0, 0, width, height);
      canvasCtx.restore();

      if (results.poseLandmarks) {
        const landmarks = results.poseLandmarks;

        // 必要なランドマークの検出を確認
        const requiredLandmarks = [11, 23]; // 左肩と左腰
        const visibilityThreshold = 0.5;

        const allVisible = requiredLandmarks.every(
          (index) => landmarks[index].visibility > visibilityThreshold
        );

        console.log('All landmarks visible:', allVisible); // デバッグ用

        if (calibrating) {
          if (allVisible) {
            if (!calibrationStartTimeRef.current) {
              calibrationStartTimeRef.current = Date.now();
              setMessage('そのまま動かずにお待ちください...');
            } else {
              const elapsedTime = Date.now() - calibrationStartTimeRef.current;
              if (elapsedTime >= 2000) {
                const shoulder = landmarks[11];
                const hip = landmarks[23];

                const shoulderCoords = [shoulder.x * width, shoulder.y * height];
                const hipCoords = [hip.x * width, hip.y * height];

                const angle = calculateAngle(hipCoords, shoulderCoords); // ヒップを基点としたショルダーベクトルの角度
                initialAngleRef.current = angle;
                console.log('Initial angle set:', initialAngleRef.current);
                setCalibrating(false);
                setMessage('');
              }
            }
          } else {
            calibrationStartTimeRef.current = null;
            setMessage('左肩と左腰がカメラに映るようにしてください。');
          }
        } else {
          if (allVisible) {
            const shoulder = landmarks[11];
            const hip = landmarks[23];

            const shoulderCoords = [shoulder.x * width, shoulder.y * height];
            const hipCoords = [hip.x * width, hip.y * height];

            const angle = calculateAngle(hipCoords, shoulderCoords); // ヒップを基点としたショルダーベクトルの角度
            setCurrentAngle(angle);

            console.log('Current angle:', angle); // デバッグ用

            // ポジションの判定
            let position = lastPositionRef.current || 'center';

            const angleDifference = angle - initialAngleRef.current;

            const forwardThreshold = 3; // 前屈時の閾値（度）
            const backwardThreshold = -3; // 後屈時の閾値（度）

            if (angleDifference >= forwardThreshold) {
              position = 'forward';
            } else if (angleDifference <= backwardThreshold) {
              position = 'backward';
            } else {
              position = 'center';
            }

            lastPositionRef.current = position;
            setCurrentDetectedPosition(position);

            // シーケンスを更新
            const sequenceCompleted = stretchSeqRef.current.update(position);
            if (sequenceCompleted) {
              setCompleted(true);
              onComplete();
              return;
            }

            setNextPosition(stretchSeqRef.current.getNextPosition());
            setRemainingLoops(stretchSeqRef.current.getRemainingLoops());

            // カウントダウンタイマーの設定
            if (stretchSeqRef.current.positionStartTime) {
              const remainingTime = stretchSeqRef.current.getRemainingTime();
              setCountdown(remainingTime);
              setIsWaiting(true);
            } else {
              setIsWaiting(false);
              setCountdown(0);
            }
          } else {
            setIsWaiting(false);
            setCountdown(0);
            setCurrentDetectedPosition('検出できません');
            setCurrentAngle(null); // ランドマークが検出できない場合はnullにする
            console.log('Landmarks not visible during sequence'); // デバッグ用
          }
        }
      } else {
        if (calibrating) {
          calibrationStartTimeRef.current = null;
          setMessage('左肩と左腰がカメラに映るようにしてください。');
        }
        setCurrentDetectedPosition('検出できません');
        setCurrentAngle(null); // ランドマークが検出できない場合はnullにする
        console.log('No pose landmarks detected'); // デバッグ用
      }

      // 次のフレームを処理
      if (isMounted) {
        animationFrameIdRef.current = requestAnimationFrame(() => {
          pose.send({ image: videoRef.current });
        });
      }
    }

    async function init() {
      await setupCamera();

      pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        },
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      pose.onResults(onResults);

      // 初回のフレームを処理
      pose.send({ image: videoRef.current });
    }

    init();

    return () => {
      isMounted = false; // アンマウント時にフラグを更新
      if (pose) pose.close();
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [onComplete]);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md relative">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">腰のストレッチ</h2>
        </div>
        <div className="flex flex-col items-center">
          <video ref={videoRef} className="hidden"></video>
          <canvas
            ref={canvasRef}
            className="border rounded-lg mb-4"
            width="640"
            height="480"
          ></canvas>

          {calibrating ? (
            <div className="w-full px-4 py-2 bg-gray-100 rounded-lg mb-4">
              <p className="text-lg text-blue-600">{message}</p>
            </div>
          ) : (
            <>
              {/* シーケンス表示 */}
              <SequenceDisplay
                sequence={sequence}
                currentStep={stretchSeqRef.current ? stretchSeqRef.current.currentStep : 0}
                remainingLoops={remainingLoops}
              />

              <div className="w-full px-4 py-2 bg-gray-100 rounded-lg mb-4">
                <p className="text-lg text-blue-600">
                  現在検出された体勢: <strong>{currentDetectedPosition}</strong>
                </p>
                <p className="text-lg text-gray-700">
                  現在の角度:{' '}
                  <strong>
                    {currentAngle !== null ? currentAngle.toFixed(2) : '検出できません'}
                  </strong>
                </p>
                <p className="text-lg text-gray-700">
                  初期角度:{' '}
                  <strong>
                    {initialAngleRef.current ? initialAngleRef.current.toFixed(2) : '計測中...'}
                  </strong>
                </p>
                {isWaiting ? (
                  <>
                    <p className="text-lg text-blue-600">
                      現在のポジション: <strong>{nextPosition}</strong>
                    </p>
                    <p className="text-lg text-green-600">
                      キープしてください: <strong>{countdown}</strong> 秒
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-lg text-blue-600">
                      次の動作: <strong>{nextPosition}</strong>
                    </p>
                  </>
                )}
              </div>
              {completed && !isWaiting && (
                <p className="text-2xl font-semibold text-green-500">ストレッチ完了！</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ストレッチ開始関数
export function startWaistStretch() {
  return new Promise((resolve, reject) => {
    const onComplete = () => {
      ReactDOM.unmountComponentAtNode(document.getElementById('waist-stretch-root'));
      const existing = document.getElementById('waist-stretch-root');
      if (existing) {
        existing.remove();
      }
      resolve(); // ストレッチ完了時にPromiseを解決
    };

    const waistStretchRoot = document.createElement('div');
    waistStretchRoot.id = 'waist-stretch-root';
    document.body.appendChild(waistStretchRoot);

    ReactDOM.render(<WaistStretchModal onComplete={onComplete} />, waistStretchRoot);
  });
}

export default WaistStretchModal;











