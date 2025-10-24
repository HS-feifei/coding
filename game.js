// 获取DOM元素
const ball = document.getElementById('ball');
const bounceCountElement = document.getElementById('bounce-count');
const resetBtn = document.getElementById('reset-btn');
const gameArea = document.querySelector('.game-area');

// 游戏变量
let ballY = 0; // 小球Y轴位置
let velocityY = 0; // 垂直速度
let gravity = 0.6; // 重力加速度
let damping = 0.8; // 能量损耗系数（弹跳衰减）
let bounceCount = 0; // 弹跳次数
let animationId = null; // 动画帧ID
let isAnimating = false; // 动画状态标志

// 初始化游戏
function init() {
    // 获取游戏区域和小球的尺寸信息
    const gameAreaHeight = gameArea.clientHeight;
    const ballHeight = ball.offsetHeight;
    const groundPosition = gameAreaHeight - ballHeight;
    
    // 重置游戏状态
    resetGame();
    
    // 添加事件监听器
    resetBtn.addEventListener('click', resetGame);
    window.addEventListener('resize', handleResize);
}

// 重置游戏
function resetGame() {
    // 取消当前动画
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // 重置变量
    ballY = 0;
    velocityY = 0;
    bounceCount = 0;
    isAnimating = true;
    
    // 更新显示
    updateBallPosition();
    bounceCountElement.textContent = bounceCount;
    
    // 开始动画
    animate();
}

// 更新小球位置
function updateBallPosition() {
    ball.style.top = ballY + 'px';
}

// 动画主循环
function animate() {
    if (!isAnimating) return;
    
    // 获取游戏区域底部位置
    const gameAreaHeight = gameArea.clientHeight;
    const ballHeight = ball.offsetHeight;
    const groundPosition = gameAreaHeight - ballHeight;
    
    // 应用重力
    velocityY += gravity;
    
    // 更新位置
    ballY += velocityY;
    
    // 检测地面碰撞
    if (ballY >= groundPosition) {
        // 确保小球不会穿过地面
        ballY = groundPosition;
        
        // 增加弹跳次数
        bounceCount++;
        bounceCountElement.textContent = bounceCount;
        
        // 检查是否达到10次弹跳
        if (bounceCount >= 10) {
            isAnimating = false;
            return;
        }
        
        // 反弹并应用能量损耗
        velocityY = -velocityY * damping;
    }
    
    // 检测顶部碰撞（虽然理论上不会发生，但为了健壮性）
    if (ballY < 0) {
        ballY = 0;
        velocityY = -velocityY * damping;
    }
    
    // 更新小球位置
    updateBallPosition();
    
    // 继续下一帧动画
    animationId = requestAnimationFrame(animate);
}

// 处理窗口大小变化
function handleResize() {
    // 获取游戏区域底部位置
    const gameAreaHeight = gameArea.clientHeight;
    const ballHeight = ball.offsetHeight;
    const groundPosition = gameAreaHeight - ballHeight;
    
    // 确保小球不会超出游戏区域
    if (ballY > groundPosition) {
        ballY = groundPosition;
        updateBallPosition();
    }
    
    // 如果动画已停止但小球不在地面，将其置于地面
    if (!isAnimating && bounceCount >= 10) {
        ballY = groundPosition;
        updateBallPosition();
    }
}

// 页面加载完成后初始化游戏
window.addEventListener('DOMContentLoaded', init);