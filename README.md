# サンプル（プロダクト名）

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2024/07/JPHACKS2024_ogp.jpg)](https://www.youtube.com/watch?v=DZXUkEj-CSI)

## 製品概要
ポモドーロタイマー+作業姿勢とストレッチの検知

ポモドーロテクニックを使い、作業効率を上げながら健康をサポートする革新的なタイマーです。研究者や学生などのデスクワーカーのために、作業姿勢を改善し健康を意識的に取り入れることを目的としています。
### 背景(製品開発のきっかけ、課題等）
ストーリーとしては、今回のメンバーが腰を痛めてしまい、そこから想起した。また、有益なツールとして、創作後自分たちも心から使って行きたい、と思えるツールを開発したいところが根底にある。そこで、ポモドーロと健康を融合させよう、という着眼点から発想した。そのため、今回はpcの前で簡単に実行できるストレッチを用い、研究者や学生、社会人などのデスクワーカーにストレッチを代表とする運動を取り入れ、ウェルビーイングになってほしい。ポモドーロタイマーはメンバーの殆どが利用していたが、運動などと結びついているツールは見当たらなかったため、今回自分たちで創作しようと考えた。

現代では、学生や研究者を始めとして、デスクワーカーとして作業をする人が非常に増加している。しかし、デスクワーカーは体を動かす機会に乏しく、作業に熱中しすぎると、肩首腰を始めとする心身の不調が生じ、結果的に作業効率、作業量が減少してしまうという課題がある。そこで、今回はカメラで姿勢を検知し、、デスクワーカーの健康状況を改善したいと
### 製品説明（具体的な製品の説明）
ポモドーロテクニックとは、は作業時間が25分、休憩時間が5分のサイクルを繰り返すというのが基本的なテクニックです。ポモドーロタイマーとはそのテクニックを利用したタイマーです。

タスク設定:ユーザーはタスクを自分で設定でき、その後なんの作業をどの程度実行したか確認できる。
笑顔検知:タイマー開始のシグナルとして笑顔を検知し、その後タイマーが始動
作業期間: タイマーが終了するまでの25分間、効率的なタスク集中が可能。タイマー起動中、姿勢の良し悪しをトラッキングでき、統計情報として作業終了後に確認可能。
ストレッチ誘導: タイマー終了後、カメラがストレッチ動作を認識し、ガイドに従って体を動かすことで自動的に休憩時間が開始。

### 特長
デスクワーカーの作業効率はもちろん、健康状況も楽しく改善させられるポモドーロタイマー。

#### 1. 特長 1
始めに、基本的なポモドーロタイマーとして活用可能。加えて、ポモドーロの日別タスク別統計も確認可能で、より効率的に業務を行うことが可能。

#### 2. 特長 2
ポモドーロの終了後にストレッチをカメラで認識し、それが終わるとポモドーロの休憩時間に突入できるようにした。強制的にストレッチを誘導することで、健康も意識的に取り入れることができる。ストレッチの認識の際、ストレッチの様子を型はめ形式にガイドを表示することで、ゲーム性も持たせ、楽しくポモドーロテクニックを用いた作業が可能

#### 3. 特長 3
笑顔をシグナルに、25分の作業時間のポモドーロタイマーを開始できるようにした。笑顔と幸福度の関係は知られているため、その観点からも非常に有益だと考えられる。作業中無表情であることが多いと考えられ、意識的に笑顔の回数を増やすことで、ウェルビーイングをもたらすことができる。

### 解決出来ること
作業における集中力、体の不調、作業情報の整理、ストレッチのガイド、笑顔の回数の増加
### 今後の展望
より多種のストレッチの提案、型ハメストレッチのガイド調整及びゲーム性の増加、Webカメラ以外(モバイル等)の実装、ポモドーロタイマー機能の拡大、UIの調整、シンクロストレッチ機能の実装、コホート目標の設定やフレンド機能の実装、生成aiを用いた、表情やストレッチの検知後のアドバイスなどの実装
### 注力したこと（こだわり等）
実際に自分たちが開発後、継続的に使える機能を考えることに重点を置いた。また、ゲーム性や楽しさの面も考慮することで、ユーザーの持続性をもたらした。
-

## 開発技術
タイマーの終了、開始のシグナルとしてのストレッチの利用　ストレッチ状態の定義と検知、作業姿勢の良し悪しの定義と検知
### 活用した技術
笑顔の検出、体のパーツの座標を取得する技術、
#### API・データ

-
-

#### フレームワーク・ライブラリ・モジュール
react mediapipe firebase
-
-

#### デバイス
pc　webカメラ
-

### 独自技術

#### ハッカソンで開発した独自機能・技術

- 独自で開発したものの内容をこちらに記載してください
- 特に力を入れた部分をファイルリンク、または commit_id を記載してください。
