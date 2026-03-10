import { Router } from 'itty-router';

const router = Router();

// 前台页面
const FRONTEND_HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>导航</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-color: #f5f5f5;
            --card-bg: #ffffff;
            --text-color: #333333;
            --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            --hover-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
            --transition: all 0.3s ease;
        }

        .dark {
            --bg-color: #1a1a1a;
            --card-bg: #2d2d2d;
            --text-color: #e0e0e0;
            --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            --hover-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            min-height: 100vh;
            transition: var(--transition);
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px 0;
        }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
        }

        h1 {
            font-size: 2rem;
            font-weight: 700;
            transition: var(--transition);
        }

        .theme-toggle {
            background: var(--card-bg);
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: var(--card-shadow);
            transition: var(--transition);
        }

        .theme-toggle:hover {
            transform: scale(1.1);
            box-shadow: var(--hover-shadow);
        }

        .theme-toggle i {
            font-size: 1.5rem;
        }

        .groups {
            display: flex;
            flex-direction: column;
            gap: 40px;
        }

        .group {
            animation: fadeIn 0.5s ease-in-out;
        }

        .group h2 {
            font-size: 1.5rem;
            margin-bottom: 20px;
            padding-left: 10px;
            border-left: 4px solid #667eea;
            transition: var(--transition);
        }

        .links {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
        }

        .link-card {
            background: var(--card-bg);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            box-shadow: var(--card-shadow);
            transition: var(--transition);
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .link-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--hover-shadow);
        }

        .link-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 15px;
            border-radius: 50%;
            object-fit: cover;
            transition: var(--transition);
        }

        .link-card:hover .link-icon {
            transform: scale(1.1);
        }

        .link-name {
            font-weight: 600;
            margin-bottom: 5px;
            transition: var(--transition);
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 768px) {
            .links {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            }

            .link-card {
                padding: 15px;
            }

            .link-icon {
                width: 50px;
                height: 50px;
            }

            h1 {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>导航</h1>
            <button class="theme-toggle" id="theme-toggle">
                <i class="fas fa-moon"></i>
            </button>
        </header>

        <div class="groups" id="groups">
            <!-- 动态生成的分组和链接 -->
        </div>
    </div>

    <script>
        // 主题切换
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        const icon = themeToggle.querySelector('i');

        // 检查本地存储的主题
        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark');
            if (body.classList.contains('dark')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });

        // 加载导航数据
        async function loadNavigation() {
            try {
                const response = await fetch('/api/navigation');
                const data = await response.json();
                
                const groupsContainer = document.getElementById('groups');
                groupsContainer.innerHTML = '';

                data.groups.forEach(group => {
                    const groupElement = document.createElement('div');
                    groupElement.className = 'group';
                    groupElement.innerHTML = `
                        <h2>${group.name}</h2>
                        <div class="links">
                            ${group.links.map(link => `
                                <div class="link-card" data-id="${link.id}" data-url="${link.url}">
                                    <img src="${link.icon}" alt="${link.name}" class="link-icon">
                                    <div class="link-name">${link.name}</div>
                                </div>
                            `).join('')}
                        </div>
                    `;
                    groupsContainer.appendChild(groupElement);
                });

                // 添加点击事件
                document.querySelectorAll('.link-card').forEach(card => {
                    card.addEventListener('click', function() {
                        const url = this.dataset.url;
                        window.location.href = `/redirect?url=${encodeURIComponent(url)}`;
                    });
                });
            } catch (error) {
                console.error('加载导航数据失败:', error);
            }
        }

        // 页面加载时加载数据
        loadNavigation();
    </script>
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
</body>
</html>
`;

// 中间页
const REDIRECT_HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>跳转中...</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            animation: fadeIn 0.5s ease-in-out;
        }

        .anime-bg {
            width: 200px;
            height: 200px;
            margin: 0 auto 30px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite;
        }

        .anime-bg i {
            font-size: 4rem;
            animation: rotate 10s linear infinite;
        }

        h1 {
            font-size: 2rem;
            margin-bottom: 20px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        p {
            font-size: 1.1rem;
            margin-bottom: 30px;
            opacity: 0.9;
        }

        .countdown {
            font-size: 3rem;
            font-weight: 700;
            margin: 20px 0;
            animation: countdown 1s steps(1) infinite;
        }

        .redirect-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 12px 30px;
            border-radius: 30px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }

        .redirect-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
            100% {
                transform: scale(1);
            }
        }

        @keyframes rotate {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        @keyframes countdown {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
            100% {
                opacity: 1;
            }
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 1.5rem;
            }

            .countdown {
                font-size: 2rem;
            }

            .anime-bg {
                width: 150px;
                height: 150px;
            }

            .anime-bg i {
                font-size: 3rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="anime-bg">
            <i class="fas fa-rocket"></i>
        </div>
        <h1>跳转中...</h1>
        <p>正在跳转到目标网站，请稍候</p>
        <div class="countdown" id="countdown">5</div>
        <a href="" class="redirect-btn" id="redirect-btn">立即跳转</a>
    </div>

    <script>
        const url = new URLSearchParams(window.location.search).get('url');
        const countdownElement = document.getElementById('countdown');
        const redirectBtn = document.getElementById('redirect-btn');

        redirectBtn.href = url;

        let countdown = 5;
        const interval = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(interval);
                window.location.href = url;
            }
        }, 1000);

        redirectBtn.addEventListener('click', () => {
            clearInterval(interval);
        });
    </script>
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
</body>
</html>
`;

// 后台登录页面
const ADMIN_LOGIN_HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>后台登录</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
        }

        .login-container {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            padding: 40px;
            max-width: 400px;
            width: 100%;
            animation: fadeIn 0.5s ease-in-out;
        }

        h1 {
            text-align: center;
            color: white;
            margin-bottom: 30px;
            font-size: 1.8rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            color: white;
            margin-bottom: 8px;
            font-weight: 600;
        }

        input {
            width: 100%;
            padding: 12px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        input::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }

        input:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.15);
        }

        button {
            width: 100%;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 12px;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
        }

        button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }

        .error-message {
            background: rgba(255, 0, 0, 0.2);
            color: white;
            padding: 10px;
            border-radius: 10px;
            margin: 15px 0;
            text-align: center;
            display: none;
            animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 768px) {
            .login-container {
                padding: 30px;
            }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>后台登录</h1>
        <div class="error-message" id="error-message"></div>
        <form id="login-form">
            <div class="form-group">
                <label for="username">用户名</label>
                <input type="text" id="username" name="username" placeholder="请输入用户名" required>
            </div>
            <div class="form-group">
                <label for="password">密码</label>
                <input type="password" id="password" name="password" placeholder="请输入密码" required>
            </div>
            <button type="submit">登录</button>
        </form>
    </div>

    <script>
        const loginForm = document.getElementById('login-form');
        const errorMessage = document.getElementById('error-message');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    window.location.href = '/admin/';
                } else {
                    errorMessage.textContent = result.error || '登录失败';
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                console.error('登录失败:', error);
                errorMessage.textContent = '登录失败，请稍后重试';
                errorMessage.style.display = 'block';
            }
        });
    </script>
</body>
</html>
`;

// 后台管理页面
const ADMIN_HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>后台管理</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            min-height: 100vh;
            background: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
        }

        h1 {
            font-size: 1.8rem;
            color: #333;
        }

        .header-actions {
            display: flex;
            gap: 10px;
        }

        button {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-primary {
            background: #667eea;
            color: white;
        }

        .btn-secondary {
            background: #e0e0e0;
            color: #333;
        }

        .btn-danger {
            background: #ff4757;
            color: white;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            border-bottom: 1px solid #e0e0e0;
        }

        .tab {
            padding: 10px 20px;
            border: none;
            background: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .tab.active {
            border-bottom-color: #667eea;
            color: #667eea;
        }

        .tab-content {
            display: none;
            animation: fadeIn 0.3s ease-in-out;
        }

        .tab-content.active {
            display: block;
        }

        .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 1.2rem;
            margin-bottom: 20px;
            color: #333;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #555;
        }

        input, select, textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .icon-preview {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            margin: 10px 0;
            border: 2px solid #e0e0e0;
        }

        .groups-list, .links-list {
            margin-top: 20px;
        }

        .group-item, .link-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #e0e0e0;
            transition: all 0.3s ease;
        }

        .group-item:hover, .link-item:hover {
            background: #f9f9f9;
        }

        .item-actions {
            display: flex;
            gap: 10px;
        }

        .btn-sm {
            padding: 5px 10px;
            font-size: 0.8rem;
        }

        .message {
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            text-align: center;
            display: none;
            animation: fadeIn 0.3s ease-in-out;
        }

        .success-message {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .error-message {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 768px) {
            .header-actions {
                flex-direction: column;
            }

            .tabs {
                flex-direction: column;
                gap: 5px;
            }

            .group-item, .link-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }

            .item-actions {
                align-self: flex-end;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>后台管理</h1>
            <div class="header-actions">
                <button class="btn-secondary" id="export-btn">导出配置</button>
                <button class="btn-secondary" id="import-btn">导入配置</button>
                <button class="btn-danger" id="logout-btn">退出登录</button>
            </div>
        </header>

        <div class="message success-message" id="success-message"></div>
        <div class="message error-message" id="error-message"></div>

        <div class="tabs">
            <button class="tab active" data-tab="groups">分组管理</button>
            <button class="tab" data-tab="links">链接管理</button>
            <button class="tab" data-tab="settings">设置</button>
        </div>

        <!-- 分组管理 -->
        <div class="tab-content active" id="groups-content">
            <div class="card">
                <h2>创建分组</h2>
                <form id="create-group-form">
                    <div class="form-group">
                        <label for="group-name">分组名称</label>
                        <input type="text" id="group-name" name="name" placeholder="请输入分组名称" required>
                    </div>
                    <button type="submit" class="btn-primary">创建分组</button>
                </form>
            </div>

            <div class="card">
                <h2>分组列表</h2>
                <div class="groups-list" id="groups-list">
                    <!-- 动态生成分组列表 -->
                </div>
            </div>
        </div>

        <!-- 链接管理 -->
        <div class="tab-content" id="links-content">
            <div class="card">
                <h2>添加链接</h2>
                <form id="create-link-form">
                    <div class="form-group">
                        <label for="link-group">所属分组</label>
                        <select id="link-group" name="group_id" required>
                            <!-- 动态生成分组选项 -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="link-name">链接名称</label>
                        <input type="text" id="link-name" name="name" placeholder="请输入链接名称" required>
                    </div>
                    <div class="form-group">
                        <label for="link-url">链接地址</label>
                        <input type="url" id="link-url" name="url" placeholder="请输入链接地址" required>
                    </div>
                    <div class="form-group">
                        <label for="link-icon">链接图标</label>
                        <input type="file" id="link-icon" name="icon" accept="image/*" required>
                        <img src="" alt="图标预览" class="icon-preview" id="icon-preview" style="display: none;">
                    </div>
                    <button type="submit" class="btn-primary">添加链接</button>
                </form>
            </div>

            <div class="card">
                <h2>链接列表</h2>
                <div class="links-list" id="links-list">
                    <!-- 动态生成链接列表 -->
                </div>
            </div>
        </div>

        <!-- 设置 -->
        <div class="tab-content" id="settings-content">
            <div class="card">
                <h2>背景设置</h2>
                <form id="background-form">
                    <div class="form-group">
                        <label for="background">背景图片</label>
                        <input type="file" id="background" name="background" accept="image/*">
                    </div>
                    <button type="submit" class="btn-primary">设置背景</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        // 标签切换
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 移除所有活动状态
                tabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // 添加当前活动状态
                tab.classList.add('active');
                const tabId = tab.dataset.tab;
                document.getElementById(`${tabId}-content`).classList.add('active');
                
                // 加载对应内容
                if (tabId === 'groups') loadGroups();
                if (tabId === 'links') loadLinks();
            });
        });

        // 消息提示
        function showMessage(type, message) {
            const successMsg = document.getElementById('success-message');
            const errorMsg = document.getElementById('error-message');
            
            if (type === 'success') {
                successMsg.textContent = message;
                successMsg.style.display = 'block';
                errorMsg.style.display = 'none';
            } else {
                errorMsg.textContent = message;
                errorMsg.style.display = 'block';
                successMsg.style.display = 'none';
            }
            
            setTimeout(() => {
                successMsg.style.display = 'none';
                errorMsg.style.display = 'none';
            }, 3000);
        }

        // 加载分组列表
        async function loadGroups() {
            try {
                const response = await fetch('/api/admin/groups');
                const groups = await response.json();
                
                const groupsList = document.getElementById('groups-list');
                groupsList.innerHTML = '';
                
                groups.forEach(group => {
                    const groupItem = document.createElement('div');
                    groupItem.className = 'group-item';
                    groupItem.innerHTML = `
                        <span>${group.name}</span>
                        <div class="item-actions">
                            <button class="btn-sm btn-primary" onclick="editGroup(${group.id})">编辑</button>
                            <button class="btn-sm btn-danger" onclick="deleteGroup(${group.id})">删除</button>
                        </div>
                    `;
                    groupsList.appendChild(groupItem);
                });
                
                // 更新链接表单的分组选项
                const linkGroupSelect = document.getElementById('link-group');
                linkGroupSelect.innerHTML = '';
                groups.forEach(group => {
                    const option = document.createElement('option');
                    option.value = group.id;
                    option.textContent = group.name;
                    linkGroupSelect.appendChild(option);
                });
            } catch (error) {
                console.error('加载分组失败:', error);
                showMessage('error', '加载分组失败');
            }
        }

        // 加载链接列表
        async function loadLinks() {
            try {
                const response = await fetch('/api/admin/links');
                const links = await response.json();
                
                const linksList = document.getElementById('links-list');
                linksList.innerHTML = '';
                
                links.forEach(link => {
                    const linkItem = document.createElement('div');
                    linkItem.className = 'link-item';
                    linkItem.innerHTML = `
                        <div>
                            <strong>${link.name}</strong><br>
                            <small>${link.url}</small>
                        </div>
                        <div class="item-actions">
                            <button class="btn-sm btn-primary" onclick="editLink(${link.id})">编辑</button>
                            <button class="btn-sm btn-danger" onclick="deleteLink(${link.id})">删除</button>
                        </div>
                    `;
                    linksList.appendChild(linkItem);
                });
            } catch (error) {
                console.error('加载链接失败:', error);
                showMessage('error', '加载链接失败');
            }
        }

        // 创建分组
        document.getElementById('create-group-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('group-name').value;
            
            try {
                const response = await fetch('/api/admin/groups', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name })
                });
                
                if (response.ok) {
                    showMessage('success', '分组创建成功');
                    document.getElementById('create-group-form').reset();
                    loadGroups();
                } else {
                    const error = await response.json();
                    showMessage('error', error.error || '创建分组失败');
                }
            } catch (error) {
                console.error('创建分组失败:', error);
                showMessage('error', '创建分组失败');
            }
        });

        // 图标预览
        document.getElementById('link-icon').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('icon-preview');
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });

        // 添加链接
        document.getElementById('create-link-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('group_id', document.getElementById('link-group').value);
            formData.append('name', document.getElementById('link-name').value);
            formData.append('url', document.getElementById('link-url').value);
            formData.append('icon', document.getElementById('link-icon').files[0]);
            
            try {
                const response = await fetch('/api/admin/links', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    showMessage('success', '链接添加成功');
                    document.getElementById('create-link-form').reset();
                    document.getElementById('icon-preview').style.display = 'none';
                    loadLinks();
                } else {
                    const error = await response.json();
                    showMessage('error', error.error || '添加链接失败');
                }
            } catch (error) {
                console.error('添加链接失败:', error);
                showMessage('error', '添加链接失败');
            }
        });

        // 设置背景
        document.getElementById('background-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('background', document.getElementById('background').files[0]);
            
            try {
                const response = await fetch('/api/admin/settings/background', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    showMessage('success', '背景设置成功');
                } else {
                    const error = await response.json();
                    showMessage('error', error.error || '设置背景失败');
                }
            } catch (error) {
                console.error('设置背景失败:', error);
                showMessage('error', '设置背景失败');
            }
        });

        // 导出配置
        document.getElementById('export-btn').addEventListener('click', async () => {
            try {
                const response = await fetch('/api/admin/export');
                const data = await response.json();
                
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'nav-config.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showMessage('success', '配置导出成功');
            } catch (error) {
                console.error('导出配置失败:', error);
                showMessage('error', '导出配置失败');
            }
        });

        // 导入配置
        document.getElementById('import-btn').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        try {
                            const data = JSON.parse(e.target.result);
                            
                            const response = await fetch('/api/admin/import', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                            });
                            
                            if (response.ok) {
                                showMessage('success', '配置导入成功');
                                loadGroups();
                                loadLinks();
                            } else {
                                const error = await response.json();
                                showMessage('error', error.error || '导入配置失败');
                            }
                        } catch (error) {
                            console.error('导入配置失败:', error);
                            showMessage('error', '导入配置失败');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        });

        // 退出登录
        document.getElementById('logout-btn').addEventListener('click', async () => {
            try {
                await fetch('/api/admin/logout');
                window.location.href = '/admin/login';
            } catch (error) {
                console.error('退出登录失败:', error);
            }
        });

        // 编辑分组
        window.editGroup = async (id) => {
            const name = prompt('请输入新的分组名称:');
            if (name) {
                try {
                    const response = await fetch(`/api/admin/groups/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name })
                    });
                    
                    if (response.ok) {
                        showMessage('success', '分组编辑成功');
                        loadGroups();
                    } else {
                        const error = await response.json();
                        showMessage('error', error.error || '编辑分组失败');
                    }
                } catch (error) {
                    console.error('编辑分组失败:', error);
                    showMessage('error', '编辑分组失败');
                }
            }
        };

        // 删除分组
        window.deleteGroup = async (id) => {
            if (confirm('确定要删除这个分组吗？')) {
                try {
                    const response = await fetch(`/api/admin/groups/${id}`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        showMessage('success', '分组删除成功');
                        loadGroups();
                        loadLinks();
                    } else {
                        const error = await response.json();
                        showMessage('error', error.error || '删除分组失败');
                    }
                } catch (error) {
                    console.error('删除分组失败:', error);
                    showMessage('error', '删除分组失败');
                }
            }
        };

        // 编辑链接
        window.editLink = async (id) => {
            try {
                const response = await fetch(`/api/admin/links/${id}`);
                const link = await response.json();
                
                const name = prompt('请输入新的链接名称:', link.name);
                const url = prompt('请输入新的链接地址:', link.url);
                
                if (name && url) {
                    const response = await fetch(`/api/admin/links/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name, url })
                    });
                    
                    if (response.ok) {
                        showMessage('success', '链接编辑成功');
                        loadLinks();
                    } else {
                        const error = await response.json();
                        showMessage('error', error.error || '编辑链接失败');
                    }
                }
            } catch (error) {
                console.error('编辑链接失败:', error);
                showMessage('error', '编辑链接失败');
            }
        };

        // 删除链接
        window.deleteLink = async (id) => {
            if (confirm('确定要删除这个链接吗？')) {
                try {
                    const response = await fetch(`/api/admin/links/${id}`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        showMessage('success', '链接删除成功');
                        loadLinks();
                    } else {
                        const error = await response.json();
                        showMessage('error', error.error || '删除链接失败');
                    }
                } catch (error) {
                    console.error('删除链接失败:', error);
                    showMessage('error', '删除链接失败');
                }
            }
        };

        // 初始加载分组和链接
        loadGroups();
        loadLinks();
    </script>
</body>
</html>
`;

// 处理静态页面请求
router.get('/', () => {
    return new Response(FRONTEND_HTML, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }
    });
});

// 处理跳转中间页
router.get('/redirect', (request) => {
    const url = request.query.url;
    if (!url) {
        return new Response('缺少跳转地址', { status: 400 });
    }
    return new Response(REDIRECT_HTML, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }
    });
});

// 后台登录页面
router.get('/admin/login', () => {
    return new Response(ADMIN_LOGIN_HTML, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }
    });
});

// 后台管理页面
router.get('/admin/', async (request) => {
    // 检查是否登录
    const session = request.cookies.get('admin_session');
    if (!session || session !== env.ADMIN_PASSWORD) {
        return Response.redirect('/admin/login', 302);
    }
    return new Response(ADMIN_HTML, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }
    });
});

// 获取导航数据
router.get('/api/navigation', async () => {
    try {
        // 获取所有分组
        const groupsStmt = await env.DB.prepare('SELECT id, name FROM groups ORDER BY created_at');
        const groups = await groupsStmt.all();
        
        // 获取每个分组的链接
        const result = [];
        for (const group of groups) {
            const linksStmt = await env.DB.prepare('SELECT id, name, url, icon FROM links WHERE group_id = ? ORDER BY created_at');
            const links = await linksStmt.bind(group.id).all();
            result.push({ ...group, links });
        }
        
        return new Response(JSON.stringify({ groups: result }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('获取导航数据失败:', error);
        return new Response(JSON.stringify({ error: '获取导航数据失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// 后台登录API
router.post('/api/admin/login', async (request) => {
    try {
        const data = await request.json();
        const { username, password } = data;
        
        if (username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD) {
            return new Response(JSON.stringify({ success: true }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': `admin_session=${env.ADMIN_PASSWORD}; Path=/; HttpOnly; Secure; SameSite=Strict`
                }
            });
        } else {
            return new Response(JSON.stringify({ error: '用户名或密码错误' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        console.error('登录失败:', error);
        return new Response(JSON.stringify({ error: '登录失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// 后台退出登录
router.get('/api/admin/logout', () => {
    return new Response(JSON.stringify({ success: true }), {
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': 'admin_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
        }
    });
});

// 分组管理API
router.get('/api/admin/groups', async (request) => {
    // 检查是否登录
    const session = request.cookies.get('admin_session');
    if (!session || session !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: '未授权' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const stmt = await env.DB.prepare('SELECT id, name FROM groups ORDER BY created_at');
        const groups = await stmt.all();
        return new Response(JSON.stringify(groups), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('获取分组失败:', error);
        return new Response(JSON.stringify({ error: '获取分组失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

router.post('/api/admin/groups', async (request) => {
    // 检查是否登录
    const session = request.cookies.get('admin_session');
    if (!session || session !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: '未授权' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const data = await request.json();
        const { name } = data;
        
        const stmt = await env.DB.prepare('INSERT INTO groups (name) VALUES (?)');
        await stmt.bind(name).run();
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('创建分组失败:', error);
        return new Response(JSON.stringify({ error: '创建分组失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

router.put('/api/admin/groups/:id', async (request) => {
    // 检查是否登录
    const session = request.cookies.get('admin_session');
    if (!session || session !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: '未授权' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const id = request.params.id;
        const data = await request.json();
        const { name } = data;
        
        const stmt = await env.DB.prepare('UPDATE groups SET name = ? WHERE id = ?');
        await stmt.bind(name, id).run();
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('更新分组失败:', error);
        return new Response(JSON.stringify({ error: '更新分组失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

router.delete('/api/admin/groups/:id', async (request) => {
    // 检查是否登录
    const session = request.cookies.get('admin_session');
    if (!session || session !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: '未授权' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const id = request.params.id;
        const stmt = await env.DB.prepare('DELETE FROM groups WHERE id = ?');
        await stmt.bind(id).run();
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('删除分组失败:', error);
        return new Response(JSON.stringify({ error: '删除分组失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// 链接管理API
router.get('/api/admin/links', async (request) => {
    // 检查是否登录
    const session = request.cookies.get('admin_session');
    if (!session || session !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: '未授权' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const stmt = await env.DB.prepare('SELECT id, group_id, name, url FROM links ORDER BY created_at');
        const links = await stmt.all();
        return new Response(JSON.stringify(links), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('获取链接失败:', error);
        return new Response(JSON.stringify({ error: '获取链接失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

router.get('/api/admin/links/:id', async (request) => {
    // 检查是否登录
    const session = request.cookies.get('admin_session');
    if (!session || session !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: '未授权' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const id = request.params.id;
        const stmt = await env.DB.prepare('SELECT id, group_id, name, url FROM links WHERE id = ?');
        const link = await stmt.bind(id).get();
        return new Response(JSON.stringify(link), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('获取链接失败:', error);
        return new Response(JSON.stringify({ error: '获取链接失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

router.post('/api/admin/links', async (request) => {
    // 检查是否登录
    const session = request.cookies.get('admin_session');
    if (!session || session !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: '未授权' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const formData = await request.formData();
        const group_id = formData.get('group_id');
        const name = formData.get('name');
        const url = formData.get('url');
        const icon = formData.get('icon');
        
        // 读取图片并转换为Base64
        const iconBuffer = await icon.arrayBuffer();
        const iconBase64 = `data:${icon.type};base64,${btoa(String.fromCharCode(...new Uint8Array(iconBuffer)))}`;
        
        const stmt = await env.DB.prepare('INSERT INTO links (group_id, name, url, icon) VALUES (?, ?, ?, ?)');
        await stmt.bind(group_id, name, url, iconBase64).run();
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('创建链接失败:', error);
        return new Response(JSON.stringify({ error: '创建链接失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

router.put('/api/admin/links/:id', async (request) => {
    // 检查是否登录
    const session = request.cookies.get('admin_session');
    if (!session || session !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: '未授权' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const id = request.params.id;
        const data = await request.json();
        const { name, url } = data;
        
        const stmt = await env.DB.prepare('UPDATE links SET name = ?, url = ? WHERE id = ?');
        await stmt.bind(name, url, id).run();
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('更新链接失败:', error);
        return new Response(JSON.stringify({ error: '更新链接失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

router.delete('/api/admin/links/:id', async (request) => {
    // 检查是否登录
    const session = request.cookies.get('admin_session');
    if (!session || session !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: '未授权' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const id = request.params.id;
        const stmt = await env.DB.prepare('DELETE FROM links WHERE id = ?');
        await stmt.bind(id).run();
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('删除链接失败:', error);
        return new Response(JSON.stringify({ error: '删除链接失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// 配置管理API
router.post('/api/admin/settings/background', async (request) => {
    // 检查是否登录
    const session = request.cookies.get('admin_session');
    if (!session || session !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: '未授权' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const formData = await request.formData();
        const background = formData.get('background');
        
        // 读取图片并转换为Base64
        const bgBuffer = await background.arrayBuffer();
        const bgBase64 = `data:${background.type};base64,${btoa(String.fromCharCode(...new Uint8Array(bgBuffer)))}`;
        
        const stmt = await env.DB.prepare('UPDATE settings SET value = ? WHERE key = ?');
        await stmt.bind(bgBase64, 'background').run();
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('设置背景失败:', error);
        return new Response(JSON.stringify({ error: '设置背景失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// 导出配置
router.get('/api/admin/export', async (request) => {
    // 检查是否登录
    const session = request.cookies.get('admin_session');
    if (!session || session !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: '未授权' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        // 获取所有分组
        const groupsStmt = await env.DB.prepare('SELECT id, name FROM groups ORDER BY created_at');
        const groups = await groupsStmt.all();
        
        // 获取所有链接
        const linksStmt = await env.DB.prepare('SELECT id, group_id, name, url, icon FROM links ORDER BY created_at');
        const links = await linksStmt.all();
        
        // 获取设置
        const settingsStmt = await env.DB.prepare('SELECT key, value FROM settings');
        const settings = await settingsStmt.all();
        
        return new Response(JSON.stringify({ groups, links, settings }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('导出配置失败:', error);
        return new Response(JSON.stringify({ error: '导出配置失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// 导入配置
router.post('/api/admin/import', async (request) => {
    // 检查是否登录
    const session = request.cookies.get('admin_session');
    if (!session || session !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: '未授权' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const data = await request.json();
        const { groups, links, settings } = data;
        
        // 开始事务
        await env.DB.batch([
            'DELETE FROM links',
            'DELETE FROM groups',
            'DELETE FROM settings'
        ]);
        
        // 导入分组
        for (const group of groups) {
            const stmt = await env.DB.prepare('INSERT INTO groups (id, name, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
            await stmt.bind(group.id, group.name).run();
        }
        
        // 导入链接
        for (const link of links) {
            const stmt = await env.DB.prepare('INSERT INTO links (id, group_id, name, url, icon, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)');
            await stmt.bind(link.id, link.group_id, link.name, link.url, link.icon).run();
        }
        
        // 导入设置
        for (const setting of settings) {
            const stmt = await env.DB.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
            await stmt.bind(setting.key, setting.value).run();
        }
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('导入配置失败:', error);
        return new Response(JSON.stringify({ error: '导入配置失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// 处理404
router.all('*', () => {
    return new Response('Not Found', { status: 404 });
});

// 导出Worker
export default {
    fetch: router.handle
};
