import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  backgroundColor: "#222",
  scene: {
    create: create
  }
};

function create() {
  let score = 0;
  let timeLeft = 5;

  // 最高分
  let bestScore = localStorage.getItem("bestScore") || 0;

  // UI
  const scoreText = this.add.text(130, 40, "Score: 0", {
    fontSize: "24px",
    color: "#fff"
  });

  const timerText = this.add.text(140, 80, "Time: 5", {
    fontSize: "20px",
    color: "#fff"
  });

  const bestText = this.add.text(130, 110, "Best: " + bestScore, {
    fontSize: "20px",
    color: "#ffff00"
  });

  // 按钮（红块）
  const btn = this.add.rectangle(200, 300, 100, 100, 0xff0000)
    .setInteractive();

  // 点击逻辑
  btn.on("pointerdown", () => {
    score++;
    scoreText.setText("Score: " + score);

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
      timerText.setText("Time: " + timeLeft);

      if (timeLeft <= 0) {
        gameOver(this, score);
      }
    }
  });
}

// 按钮移动函数（带动画）
function moveButton(scene, btn) {
  const newX = Phaser.Math.Between(50, 350);
  const newY = Phaser.Math.Between(150, 550);

  scene.tweens.add({
    targets: btn,
    x: newX,
    y: newY,
    duration: 300
  });
}

// 游戏结束
function gameOver(scene, score) {
  scene.scene.pause();

  let bestScore = localStorage.getItem("bestScore") || 0;

  if (score > bestScore) {
    localStorage.setItem("bestScore", score);
    bestScore = score;
  }

  // 嘲讽文案
  const taunts = [
    "就这？",
    "手速太慢了",
    "再来一次吧",
    "你能超过10分吗？",
    "不太行啊兄弟"
  ];

  // UI显示
  scene.add.text(110, 220, "Game Over", {
    fontSize: "32px",
    color: "#ff0000"
  });

  scene.add.text(120, 270, "Score: " + score, {
    fontSize: "24px",
    color: "#fff"
  });

  scene.add.text(110, 310, "Best: " + bestScore, {
    fontSize: "20px",
    color: "#ffff00"
  });

  scene.add.text(90, 350, taunts[Math.floor(Math.random() * taunts.length)], {
    fontSize: "18px",
    color: "#fff"
  });

  scene.add.text(70, 400, "Click to Restart", {
    fontSize: "20px",
    color: "#00ffcc"
  });

  // 点击重开
  scene.input.once("pointerdown", () => {
    location.reload();
  });
}

new Phaser.Game(config);