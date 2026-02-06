/**
 * 特效模块
 * 处理所有视觉特效和动画
 */

const BlessingEffects = {
    // 祝福计数器元素
    countElement: null,
    
    // 祝福计数
    blessingCount: 0,

    /**
     * 初始化效果模块
     */
    init() {
        this.countElement = document.getElementById('blessing-count');
    },

    /**
     * 创建飘落的心形装饰
     */
    createFloatingHearts() {
        const heartsContainer = document.getElementById('hearts');
        const { symbols, animation } = BlessingConfig;

        setInterval(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = this.getRandomItem(symbols.hearts);
            
            // 随机位置和样式
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.animationDuration = `${Math.random() * 3 + 4}s`;
            heart.style.opacity = `${Math.random() * 0.5 + 0.3}`;
            heart.style.fontSize = `${Math.random() * 20 + 15}px`;
            
            heartsContainer.appendChild(heart);

            // 自动清理
            setTimeout(() => heart.remove(), animation.heartDuration);
        }, animation.heartInterval);
    },

    /**
     * 创建爆炸效果
     * @param {number} x - 爆炸中心X坐标
     * @param {number} y - 爆炸中心Y坐标
     */
    createBurst(x, y) {
        const burst = document.createElement('div');
        burst.className = 'burst-effect';
        burst.style.left = `${x}px`;
        burst.style.top = `${y}px`;
        document.body.appendChild(burst);

        const { colors, animation } = BlessingConfig;

        // 创建爆炸粒子
        for (let i = 0; i < animation.burstParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'burst-particle';
            particle.style.backgroundColor = this.getRandomItem(colors);

            // 计算粒子扩散方向
            const angle = (i / animation.burstParticles) * Math.PI * 2;
            const distance = 60 + Math.random() * 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);

            burst.appendChild(particle);
        }

        // 清理爆炸效果
        setTimeout(() => burst.remove(), animation.burstDuration);
    },

    /**
     * 创建飘落的祝福语
     * @param {number} x - 水平位置（相对于视口）
     * @param {number} y - 点击位置的Y坐标（用于参考水平位置）
     * @param {string} customText - 自定义祝福语（可选）
     */
    createFloatingBlessing(x, y, customText = null) {
        const blessing = document.createElement('div');
        blessing.className = 'floating-blessing';

        const { messages, symbols, colors, animation } = BlessingConfig;
        
        // 构建祝福语内容
        const message = customText || this.getRandomItem(messages);
        const emoji = this.getRandomItem(symbols.emojis);
        blessing.innerHTML = `${emoji} ${message} ${emoji}`;

        // 设置位置：从屏幕上方开始飘落，水平位置基于点击位置
        // 添加随机偏移，使多个祝福不会完全重叠
        const randomOffset = (Math.random() - 0.5) * 100;
        blessing.style.left = `${x + randomOffset}px`;
        blessing.style.top = '-50px'; // 从屏幕上方外开始
        blessing.style.color = this.getRandomItem(colors);

        // 随机选择飘落动画样式（5种）
        const animationStyles = [
            'fallAndFade',      // 直线旋转下落
            'fallAndFade2',     // 左右摇摆下落
            'fallAndFade3',     // 螺旋下落
            'fallAndFade4',     // 波浪下落
            'fallAndFade5'      // 弹跳下落
        ];
        const randomAnimation = animationStyles[Math.floor(Math.random() * animationStyles.length)];
        blessing.style.animation = `${randomAnimation} 5s linear forwards`;

        // 随机字体大小
        const fontSizes = ['16px', '18px', '20px', '22px', '24px'];
        blessing.style.fontSize = fontSizes[Math.floor(Math.random() * fontSizes.length)];

        document.body.appendChild(blessing);

        // 更新计数
        this.updateBlessingCount();

        // 自动清理
        setTimeout(() => blessing.remove(), animation.blessingDuration);
    },

    /**
     * 更新祝福计数
     */
    updateBlessingCount() {
        this.blessingCount++;
        if (this.countElement) {
            this.countElement.textContent = this.blessingCount;
            
            // 添加缩放动画
            this.countElement.style.transform = 'scale(1.5)';
            setTimeout(() => {
                this.countElement.style.transform = 'scale(1)';
            }, 200);
        }
    },

    /**
     * 从数组中随机获取一项
     * @param {Array} array - 源数组
     * @returns {*} 随机项
     */
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
};