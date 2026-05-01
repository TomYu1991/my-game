import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  backgroundColor: "#ffffff",
  scene: {
    preload: preload,
    create: create
  }
};

// 通用文字样式
const STYLES = {
  title: {
    fontSize: "28px",
    fontFamily: "Arial Black, Arial",
    color: "#ffffff",
    stroke: "#333333",
    strokeThickness: 4,
    shadow: { offsetX: 2, offsetY: 2, color: "#00000066", blur: 4, fill: true }
  },
  score: {
    fontSize: "22px",
    fontFamily: "Arial Black, Arial",
    color: "#ffffff",
    stroke: "#222222",
    strokeThickness: 3,
    shadow: { offsetX: 1, offsetY: 1, color: "#00000066", blur: 3, fill: true }
  },
  timer: {
    fontSize: "20px",
    fontFamily: "Arial Black, Arial",
    color: "#ffffff",
    stroke: "#222222",
    strokeThickness: 3,
    shadow: { offsetX: 1, offsetY: 1, color: "#00000066", blur: 3, fill: true }
  },
  best: {
    fontSize: "18px",
    fontFamily: "Arial Black, Arial",
    color: "#ffe040",
    stroke: "#333333",
    strokeThickness: 3,
    shadow: { offsetX: 1, offsetY: 1, color: "#00000066", blur: 3, fill: true }
  }
};

function preload() {
  this.load.image("mosquito", "/src/assets/mosquito.png");
  this.load.image("bg", "/src/assets/hands.png");
}

function create() {
  let score = 0;
  let timeLeft = 5;

  // 背景图
  const bg = this.add.image(200, 300, "bg");
  bg.setDisplaySize(400, 600);

  // 顶部信息栏半透明背景
  const topBar = this.add.rectangle(200, 0, 400, 70, 0x000000, 0.45);
  topBar.setOrigin(0.5, 0);

  // 最高分
  let bestScore = localStorage.getItem("bestScore") || 0;

  // 标题
  this.add.text(200, 8, "🦟 消灭蚊子", {
    fontSize: "16px",
    fontFamily: "Arial",
    color: "#ffffff",
    stroke: "#333333",
    strokeThickness: 2,
  }).setOrigin(0.5, 0);

  // Score 左侧 | Time 中间 | Best 右侧
  const scoreText = this.add.text(15, 36, "🎯 " + score, STYLES.score);
  const timerText = this.add.text(200, 36, "⏱ " + timeLeft + "s", STYLES.timer).setOrigin(0.5, 0);
  const bestText = this.add.text(385, 36, "👑 " + bestScore, STYLES.best).setOrigin(1, 0);

  // 蚊子
  const btn = this.add.image(200, 350, "mosquito")
    .setDisplaySize(80, 80)
    .setInteractive();

  // 点击逻辑
  btn.on("pointerdown", () => {
    score++;
    scoreText.setText("🎯 " + score);

    // 延长时间（最多5秒）
    timeLeft = Math.min(timeLeft + 1, 5);

    // 随机位置
    moveButton(this, btn);

    // 逐渐变小（难度增加）
    btn.scale *= 0.9;
  });

  // 自动移动（增加难度）
  this.time.addEvent({
    delay: 800,
    loop: true,
    callback: () => {
      moveButton(this, btn);
    }
  });

  // 倒计时
  this.time.addEvent({
    delay: 1000,
    loop: true,
    callback: () => {
      timeLeft--;
      timerText.setText("⏱ " + timeLeft + "s");

      // 时间少于2秒变红色警告
      if (timeLeft <= 2) {
        timerText.setColor("#ff4444");
      } else {
        timerText.setColor("#ffffff");
      }

      if (timeLeft <= 0) {
        gameOver(this, score);
      }
    }
  });
}

// 蚊子移动函数（带动画 + 随机旋转/翻转）
function moveButton(scene, btn) {
  const newX = Phaser.Math.Between(50, 350);
  const newY = Phaser.Math.Between(100, 550);

  const newAngle = Phaser.Math.Between(0, 180);
  const flipX = Math.random() > 0.5;

  scene.tweens.add({
    targets: btn,
    x: newX,
    y: newY,
    angle: newAngle,
    duration: 300,
    onStart: () => {
      btn.setFlipX(flipX);
    }
  });
}

// 游戏结束
function gameOver(scene, score) {
  scene.scene.pause();

  let bestScore = localStorage.getItem("bestScore") || 0;
  const isNewBest = score > bestScore;

  if (isNewBest) {
    localStorage.setItem("bestScore", score);
    bestScore = score;
  }

  // 嘲讽文案
  const taunts = [
    "就这？蚊子都笑了 😏",
    "手速太慢，被蚊子叮了吧 🦟",
    "再来一次吧 💪",
    "你能消灭10只吗？🤔",
    "蚊子：谢谢你放我一马 🫡"
  ];

  // 半透明遮罩
  const overlay = scene.add.rectangle(200, 300, 400, 600, 0x000000, 0.6);

  // 弹窗面板
  const panel = scene.add.rectangle(200, 280, 300, 280, 0x222222, 0.9);
  panel.setStrokeStyle(2, 0xffffff, 0.3);

  // Game Over 标题
  scene.add.text(200, 170, "💀 Game Over", {
    fontSize: "30px",
    fontFamily: "Arial Black, Arial",
    color: "#ff4444",
    stroke: "#000000",
    strokeThickness: 3,
  }).setOrigin(0.5);

  // 分数
  scene.add.text(200, 220, "得分: " + score, {
    fontSize: "24px",
    fontFamily: "Arial",
    color: "#ffffff",
  }).setOrigin(0.5);

  // 最高分
  scene.add.text(200, 260, (isNewBest ? "🎉 新纪录! " : "👑 最高分: ") + bestScore, {
    fontSize: "20px",
    fontFamily: "Arial",
    color: isNewBest ? "#ffdd00" : "#ffe040",
  }).setOrigin(0.5);

  // 嘲讽
  scene.add.text(200, 305, taunts[Math.floor(Math.random() * taunts.length)], {
    fontSize: "16px",
    fontFamily: "Arial",
    color: "#cccccc",
  }).setOrigin(0.5);

  // 重新开始按钮
  const restartBtn = scene.add.rectangle(200, 365, 200, 44, 0x00cc88, 1);
  restartBtn.setStrokeStyle(2, 0x00ffaa, 0.6);

  scene.add.text(200, 365, "🔄 再来一局", {
    fontSize: "20px",
    fontFamily: "Arial",
    color: "#ffffff",
  }).setOrigin(0.5);

  // 点击重开（场景已暂停，用 DOM 事件监听）
  scene.game.canvas.addEventListener("pointerdown", () => {
    location.reload();
  }, { once: true });
}

new Phaser.Game(config);
