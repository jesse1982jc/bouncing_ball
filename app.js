const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;

const ctx = c.getContext("2d");

// 設定圓球相關的變數
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;

// 設定地板相關的變數
let ground_x = 100;
let ground_y = 500;
let ground_width = 200;
let ground_height = 5;

let brickArray = [];
let count = 0;

// 取隨意區間的整數
function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    // 每製作一個磚塊，就把自己 push 到陣列裡
    brickArray.push(this);
    // 設定該 class 所創建的物件的原始狀態都是可見的
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  // 確認磚塊是否有碰到球
  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY >= this.y - radius &&
      ballY <= this.y + radius + this.height
    );
  }
}

// 製作所有的磚塊物件
for (let i = 0; i < 10; i++) {
  // 我自己寫的取亂數
  //   new Brick(
  //     Math.floor(Math.random() * 20) * 50,
  //     Math.floor(Math.random() * 10) * 50
  //   );
  // 老師教的取亂數
  new Brick(getRandomArbitrary(0, 950), getRandomArbitrary(0, 450));
}

// 監聽 canvas 物件的滑鼠事件
c.addEventListener("mousemove", (e) => {
  // 讓地板物件跟著滑鼠游標移動
  ground_x = e.clientX;
});

function drawCircle() {
  // 確認球是否有打到磚塊?
  // 要確認球是 可見的 且 有碰到磚塊
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      // 假如球跟磚塊有碰到，而且球是可見的，計數器加 1，且磚塊改成不可見的
      count++;
      console.log(count);
      brick.visible = false;
      // 改變 x, y 方向速度
      // 把 brick 磚塊從 brickArray 中移除
      if (circle_y >= brick.y + brick.height) {
        // 從下方撞擊
        ySpeed *= -1;
      } else if (circle_y <= brick.y) {
        // 從上方撞擊
        ySpeed *= -1;
      } else if (circle_x <= brick.x) {
        // 從左方撞擊
        xSpeed *= -1;
      } else if (circle_x >= brick.x + brick.width) {
        // 從右方撞擊
        xSpeed *= -1;
      }
      // 從索引位置，刪掉一個元素
      //   brickArray.splice(index, 1); // O(n)
      //   if (brickArray.length == 0) {
      //     clearInterval(game);
      //     alert("遊戲結束!!");
      //     return;
      //   }
      if (count == 10) {
        clearInterval(game);
        alert("遊戲結束!!");
      }
    }
  });

  // 確認球是否有打到橘色地板?
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + ground_width + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    if (ySpeed > 0) {
      // 球往下掉
      // 讓球往上一點
      circle_y -= 50;
    } else {
      // 球往上彈
      // 讓球往下一點
      circle_y += 50;
    }
    ySpeed *= -1;
  }

  // 判斷球是否要打到上下左右的邊界了?
  // 撞到牆壁要往反方向移動，看 x or y 的 speed *= -1
  // 注意: 這裡不能使用 if...else if... 因為有可能同時滿足兩個條件，所以必須一個一個條件判斷
  if (circle_x >= canvasWidth - radius) {
    // 確認右邊邊界
    xSpeed *= -1;
  }
  if (circle_x < radius) {
    // 確認左邊邊界
    xSpeed *= -1;
  }
  if (circle_y >= canvasHeight - radius) {
    // 確認下邊邊界
    ySpeed *= -1;
  }
  if (circle_y < radius) {
    // 確認上邊邊界
    ySpeed *= -1;
  }

  // 更動圓的座標
  circle_x += xSpeed;
  circle_y += ySpeed;

  // 畫出黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 畫出所有的 bricks 磚塊 (球是可見的才能執行畫磚塊)
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  // 畫出可控制的地板矩形
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, ground_width, ground_height);

  // 畫出圓球
  // (x, y, radius, startAngle, endAngle)
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);
