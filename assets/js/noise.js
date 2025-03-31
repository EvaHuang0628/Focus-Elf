// 音频播放控制器
class AudioController {
    constructor() {
        this.audioElements = new Map();
        this.foregroundEffects = document.getElementById('foregroundEffects');
        this.activeEffects = new Set();
        this.effectsMap = new Map([
            ['rain', {
                start: () => this.startRainEffect(),
                stop: () => this.stopRainEffect()
            }],
            ['nature', {
                start: () => this.startBirdEffect(),
                stop: () => this.stopBirdEffect()
            }]
        ]);
        this.initializeAudioElements();
        this.setupEventListeners();
    }

    initializeAudioElements() {
        const audioSources = {
            'rain': './assets/audio/rain.mp3',
            'nature': './assets/audio/nature.mp3',
            'white-noise': './assets/audio/white-noise.mp3',
            'celebration': './assets/audio/celebration.mp3',
            'remind': './assets/audio/remind.mp3'
        };

        for (const [key, src] of Object.entries(audioSources)) {
            const audio = new Audio(src);
            audio.loop = true;
            
            // 添加错误处理
            audio.addEventListener('error', (e) => {
                console.error(`音频文件 ${src} 加载失败:`, e.target.error);
                alert(`音频文件 ${key} 加载失败，请检查网络连接或刷新页面重试。`);
            });
            
            // 添加加载成功日志
            audio.addEventListener('canplaythrough', () => {
                console.log(`音频文件 ${src} 加载成功，可以播放`);
            });
            
            this.audioElements.set(key, audio);
        }
    }

    startRainEffect() {
        const createRaindrop = () => {
            const raindrop = document.createElement('div');
            raindrop.className = 'raindrop';
            raindrop.style.left = `${Math.random() * 100}%`;
            raindrop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
            this.foregroundEffects.appendChild(raindrop);
            const removeRaindrop = () => raindrop.remove();
            raindrop.addEventListener('animationend', removeRaindrop);
            // 存储事件监听器引用以便后续清理
            raindrop.removeHandler = removeRaindrop;
        };

        this.rainInterval = setInterval(() => {
            for (let i = 0; i < 3; i++) {
                createRaindrop();
            }
        }, 5000);
    }

    stopRainEffect() {
        clearInterval(this.rainInterval);
        const raindrops = this.foregroundEffects.querySelectorAll('.raindrop');
        raindrops.forEach(drop => {
            // 移除事件监听器
            if (drop.removeHandler) {
                drop.removeEventListener('animationend', drop.removeHandler);
            }
            drop.remove();
        });
    }

    startBirdEffect() {
        const createBird = () => {
            // 检查当前是否已有鸟在飞行
            const existingBirds = this.foregroundEffects.querySelectorAll('.bird');
            if (existingBirds.length > 0) {
                return; // 如果已有鸟在飞行，则不创建新的鸟
            }

            const bird = document.createElement('div');
            bird.className = 'bird';
            bird.style.setProperty('--bird-y', `${Math.random() * 60 + 10}%`);
            this.foregroundEffects.appendChild(bird);
            const removeBird = () => bird.remove();
            bird.addEventListener('animationend', removeBird);
            // 存储事件监听器引用以便后续清理
            bird.removeHandler = removeBird;
        };

        this.birdInterval = setInterval(() => {
            createBird();
        }, 5000);
    }

    stopBirdEffect() {
        clearInterval(this.birdInterval);
        const birds = this.foregroundEffects.querySelectorAll('.bird');
        birds.forEach(bird => {
            // 移除事件监听器
            if (bird.removeHandler) {
                bird.removeEventListener('animationend', bird.removeHandler);
            }
            bird.remove();
        });
    }

    setupEventListeners() {
        document.querySelectorAll('.audio-card').forEach(card => {
            const playBtn = card.querySelector('.play-btn');
            const volumeSlider = card.querySelector('.volume-slider');
            const audioKey = card.getAttribute('data-audio-key');
            const audio = this.audioElements.get(audioKey);

            if (!audio) return;

            playBtn.addEventListener('click', () => {
                if (audio.paused) {
                    console.log(`正在播放 ${audioKey} 音频...`);
                    // 先清除现有动画
                    if (this.activeEffects.has(audioKey)) {
                        const effect = this.effectsMap.get(audioKey);
                        if (effect) {
                            effect.stop();
                        }
                        this.activeEffects.delete(audioKey);
                    }
                    audio.play().catch(error => {
                        console.error(`播放 ${audioKey} 音频时出错:`, error);
                    });
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    card.classList.add('active');
                    const effect = this.effectsMap.get(audioKey);
                    if (effect) {
                        effect.start();
                    }
                    this.activeEffects.add(audioKey);
                } else {
                    console.log(`暂停播放 ${audioKey} 音频`);
                    audio.pause();
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    card.classList.remove('active');
                    if (this.activeEffects.has(audioKey)) {
                        const effect = this.effectsMap.get(audioKey);
                        if (effect) {
                            effect.stop();
                        }
                        this.activeEffects.delete(audioKey);
                    }
                }
            });

            volumeSlider.addEventListener('input', (e) => {
                audio.volume = e.target.value / 100;
            });

            // 设置初始音量
            audio.volume = volumeSlider.value / 100;
        });
    }
}

// 初始化音频控制器
document.addEventListener('DOMContentLoaded', () => {
    new AudioController();
});