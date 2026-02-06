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
     * @param {number} x - 起始X坐标
     * @param {number} y - 起始Y坐标
     * @param {string} customText - 自定义祝福语（可选）
     */
    createFloatingBlessing(x, y, customText = null) {
        const blessing = document.createElement('div');
        blessing.className = 'floating-blessing';

        const { messages, emojis, colors, animation } = BlessingConfig;
        
        // 构建祝福语内容
        const message = customText || this.getRandomItem(messages);
        const emoji = this.getRandomItem(emojis);
        blessing.innerHTML = `${emoji} ${message} ${emoji}`;

        // 设置位置和样式
        blessing.style.left = `${x}px`;
        blessing.style.top = `${y}px`;
        blessing.style.color = this.getRandomItem(colors);

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