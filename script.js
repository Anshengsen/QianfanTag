document.addEventListener("DOMContentLoaded", () => {
    const mainNav = document.getElementById('mainNav');
    const tagSelectorContainer = document.getElementById('tag-selector-container');
    const searchInput = document.getElementById('searchInput');
    const promptTextarea = document.getElementById('promptTextarea');
    const negativePromptTextarea = document.getElementById('negativePromptTextarea');
    const langSwitch = document.getElementById('langSwitch');
    const translatePositiveBtn = document.getElementById('translatePositiveBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const translateNegativeBtn = document.getElementById('translateNegativeBtn');
    const copyNegativeBtn = document.getElementById('copyNegativeBtn');

    let currentGroupIndex = 0;
    let selectedTags = new Map();

    async function translateText(text, targetLang, button) {
        if (!text.trim()) return '';
        const originalButtonText = button.textContent;
        button.disabled = true;
        button.textContent = '翻译中...';

        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data[0].map(item => item[0]).join('');
        } catch (error) {
            console.error('Translation failed:', error);
            alert('翻译服务暂时不可用，请稍后再试。');
            return text;
        } finally {
            button.disabled = false;
            button.textContent = originalButtonText;
        }
    }

    function renderNavigation() {
        mainNav.innerHTML = "";
        const navInnerContainer = document.createElement('div');
        navInnerContainer.id = 'mainNav-inner-container';

        tagData.forEach((group, groupIndex) => {
            const li = document.createElement("li");
            li.className = "nav-group";
            const groupButton = document.createElement("button");
            groupButton.className = "group-btn";
            groupButton.innerHTML = `<span>${group.group.split('(')[0].trim()}</span>`;
            groupButton.onclick = () => {
                currentGroupIndex = groupIndex;
                searchInput.value = '';
                renderGroupContent();
                updateActiveNav();
            };
            li.appendChild(groupButton);
            navInnerContainer.appendChild(li);
        });
        mainNav.appendChild(navInnerContainer);
        setupNavScroll();
        updateActiveNav();
    }
    
    function setupNavScroll() {
        const navContainer = document.getElementById('mainNav');
        const navInner = document.getElementById('mainNav-inner-container');
        if (!navContainer || !navInner) return;

        const checkOverflow = () => {
            const isOverflowing = navInner.scrollWidth > navContainer.clientWidth;
            if (isOverflowing) {
                navContainer.onmouseenter = () => {
                    const scrollDistance = navInner.scrollWidth - navContainer.clientWidth;
                    navInner.style.transform = `translateX(-${scrollDistance}px)`;
                };
                navContainer.onmouseleave = () => {
                    navInner.style.transform = 'translateX(0)';
                };
            } else {
                navContainer.onmouseenter = null;
                navContainer.onmouseleave = null;
                navInner.style.transform = 'translateX(0)';
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
    }

    function renderGroupContent() {
        tagSelectorContainer.innerHTML = "";
        const group = tagData[currentGroupIndex];
        group.categories.forEach(category => {
            const subcategoryGroup = document.createElement('div');
            subcategoryGroup.className = 'subcategory-group';
            const subcategoryHeader = document.createElement('div');
            subcategoryHeader.className = 'subcategory-header';
            const title = document.createElement('h3');
            title.textContent = category.name;
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'toggle-collapse-btn';
            toggleBtn.textContent = '展开';
            subcategoryHeader.appendChild(title);
            subcategoryHeader.appendChild(toggleBtn);
            const tagsWrapper = document.createElement('div');
            tagsWrapper.className = 'tags-wrapper';
            category.tags.forEach(tag => {
                const chip = createTagChip(tag);
                tagsWrapper.appendChild(chip);
            });
            subcategoryGroup.appendChild(subcategoryHeader);
            subcategoryGroup.appendChild(tagsWrapper);
            tagSelectorContainer.appendChild(subcategoryGroup);
            toggleBtn.onclick = () => {
                tagsWrapper.classList.toggle('is-expanded');
                toggleBtn.textContent = tagsWrapper.classList.contains('is-expanded') ? '收起' : '展开';
            };
        });
    }

    function createTagChip(tag) {
        const chip = document.createElement('div');
        chip.className = 'tag-chip';
        chip.innerHTML = `<span class="zh">${tag.zh}</span><span class="en">${tag.en}</span>`;
        if (selectedTags.has(tag.en)) {
            chip.classList.add('is-selected');
        }
        chip.onclick = () => {
            if (selectedTags.has(tag.en)) {
                selectedTags.delete(tag.en);
                chip.classList.remove('is-selected');
            } else {
                selectedTags.set(tag.en, tag);
                chip.classList.add('is-selected');
            }
            updatePromptTextarea();
        };
        return chip;
    }

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        tagSelectorContainer.innerHTML = '';
        if (!query) {
            renderGroupContent();
            return;
        }
        const results = [];
        tagData.forEach(group => {
            group.categories.forEach(category => {
                category.tags.forEach(tag => {
                    if (tag.zh.toLowerCase().includes(query) || tag.en.toLowerCase().includes(query)) {
                        results.push(tag);
                    }
                });
            });
        });
        const uniqueKeys = new Set();
        const uniqueResults = results.filter(tag => {
            const key = tag.en;
            if (uniqueKeys.has(key)) {
                return false;
            }
            uniqueKeys.add(key);
            return true;
        });
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results-container';
        if (uniqueResults.length > 0) {
            uniqueResults.forEach(tag => {
                const chip = createTagChip(tag);
                resultsContainer.appendChild(chip);
            });
        } else {
            resultsContainer.innerHTML = '<p>未找到相关标签</p>';
        }
        tagSelectorContainer.appendChild(resultsContainer);
    }

    function updatePromptTextarea() {
        const isEnglishMode = langSwitch.checked;
        let regularTagStrings = [];
        let parameterTags = new Map();

        Array.from(selectedTags.values()).forEach(tag => {
            if (tag.isParameter) {
                const paramKey = tag.en.split(' ')[0];
                parameterTags.set(paramKey, tag.en);
            } else {
                regularTagStrings.push(isEnglishMode ? tag.en : tag.zh);
            }
        });
        
        const separator = isEnglishMode ? ', ' : '，';
        const regularPart = regularTagStrings.join(separator);
        const parameterPart = Array.from(parameterTags.values()).join(' ');

        let fullPrompt = regularPart;
        if (parameterPart) {
            if(fullPrompt) {
                fullPrompt += ' ' + parameterPart;
            } else {
                fullPrompt = parameterPart;
            }
        }
        
        promptTextarea.value = fullPrompt;
    }


    function copyToClipboard(text, buttonElement) {
        if (!text.trim()) return;
        const originalText = buttonElement.textContent;
        navigator.clipboard.writeText(text).then(() => {
            buttonElement.textContent = '已复制!';
            setTimeout(() => { buttonElement.textContent = originalText; }, 1500);
        }).catch(err => {
            console.error('Copy failed: ', err);
            alert('复制失败，您的浏览器可能不支持该功能。');
        });
    }

    function clearPrompt() {
        selectedTags.clear();
        promptTextarea.value = '';
        document.querySelectorAll('.tag-chip.is-selected').forEach(c => c.classList.remove('is-selected'));
    }

    function updateActiveNav() {
        document.querySelectorAll("#mainNav .group-btn").forEach((btn, index) => {
            btn.classList.toggle("active", index === currentGroupIndex);
        });
    }
    
    async function handleTranslation(textarea, button) {
        const fullText = textarea.value.trim();
        if (!fullText) return;

        let textToTranslate = fullText;
        let parameters = '';
        const paramIndex = fullText.indexOf('--');

        if (paramIndex !== -1) {
            textToTranslate = fullText.substring(0, paramIndex).trim();
            parameters = ' ' + fullText.substring(paramIndex);
        }

        const containsChinese = /[\u4e00-\u9fa5]/.test(textToTranslate);
        const targetLang = containsChinese ? 'en' : 'zh-CN';

        if (!textToTranslate) {
            textarea.value = parameters.trim();
            return;
        }

        const translatedText = await translateText(textToTranslate, targetLang, button);
        
        if (translatedText === textToTranslate) {
            return;
        }

        let cleanedText;
        if (targetLang === 'en') {
            cleanedText = translatedText.replace(/[,，]\s*/g, ', ').trim().replace(/,$/, '');
        } else {
            cleanedText = translatedText.replace(/, /g, '，').replace(/,/g, '，').trim().replace(/，$/, '');
        }

        textarea.value = (cleanedText + parameters).trim();
    }

    function setupEventListeners() {
        langSwitch.addEventListener('change', updatePromptTextarea);
        translatePositiveBtn.addEventListener('click', () => handleTranslation(promptTextarea, translatePositiveBtn));
        copyBtn.addEventListener('click', () => copyToClipboard(promptTextarea.value, copyBtn));
        clearBtn.addEventListener('click', clearPrompt);
        translateNegativeBtn.addEventListener('click', () => handleTranslation(negativePromptTextarea, translateNegativeBtn));
        copyNegativeBtn.addEventListener('click', () => copyToClipboard(negativePromptTextarea.value, copyNegativeBtn));
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
        searchInput.addEventListener('input', performSearch);
    }
    
    function initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        const applyTheme = (theme) => {
            document.body.classList.toggle("dark", theme === "dark");
        };
        const savedTheme = localStorage.getItem("theme") || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        applyTheme(savedTheme);
        themeToggle.addEventListener('click', () => {
            const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
            applyTheme(newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }

    function init() {
        renderNavigation();
        renderGroupContent();
        setupEventListeners();
        initTheme();
    }

    init();
});