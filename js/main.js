/**
 * 主程序入口
 * 处理事件绑定和程序初始化
 */

const BlessingApp = {
    /**
     * 初始化应用
     */
    init() {
        // 初始化效果模块
        BlessingEffects.init();
        
        // 启动背景动画
        BlessingEffects.createFloatingHearts();
        
        // 绑定事件
        this.bindEvents();
        
        console.log('🎉 祝福应用已启动！点击按钮收获祝福吧~');
    },

    /**
     * 绑定所有事件
     */
    bindEvents() {
        this.bindButtonEvents();
        this.bindPageClickEvent();
    },

    /**
     * 绑定祝福按钮点击事件
     */
    bindButtonEvents() {
        const buttons = document.querySelectorAll('.wish-item');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => this.handleButtonClick(e, button));
        });
    },

    /**
     * 处理按钮点击
     * @param {Event} e - 点击事件
     * @param {HTMLElement} button - 被点击的按钮
     */
    handleButtonClick(e, button) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 创建爆炸效果
        BlessingEffects.createBurst(centerX, centerY);
        
        // 获取按钮对应的祝福语
        const customBlessing = button.getAttribute('data-blessing');
        
        // 创建多个飘落的祝福语
        this.createBlessingSequence(centerX, centerY, customBlessing);
        
        // 按钮点击反馈动画
        this.animateButton(button);
    },

    /**
     * 创建祝福语序列
     * @param {number} x - 起始X坐标
     * @param {number} y - 起始Y坐标
     * @param {string} customText - 自定义祝福语
     */
    createBlessingSequence(x, y, customText) {
        // 立即创建第一个
        BlessingEffects.createFloatingBlessing(x, y - 50, customText);
        
        // 延迟创建后续祝福语
        setTimeout(() => {
            BlessingEffects.createFloatingBlessing(
                x + (Math.random() - 0.5) * 200,
                y - 100
            );
        }, 200);
        
        setTimeout(() => {
            BlessingEffects.createFloatingBlessing(
                x + (Math.random() - 0.5) * 200,
                y - 150
            );
        }, 400);
    },

    /**
     * 按钮点击动画
     * @param {HTMLElement} button - 目标按钮
     */
    animateButton(button) {
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    },

    /**
     * 绑定页面点击事件（彩蛋功能）
     */
    bindPageClickEvent() {
        document.addEventListener('click', (e) => {
            // 如果点击的不是按钮
            if (!e.target.classList.contains('wish-item')) {
                this.handlePageClick(e);
            }
        });
    },

    /**
     * 处理页面点击
     * @param {Event} e - 点击事件
     */
    handlePageClick(e) {
        // 根据配置的概率决定是否产生祝福
        if (Math.random() < BlessingConfig.randomBlessingChance) {
            BlessingEffects.createFloatingBlessing(e.clientX, e.clientY);
        }
    }
};

// DOM加载完成后启动应用
document.addEventListener('DOMContentLoaded', () => {
    BlessingApp.init();
});