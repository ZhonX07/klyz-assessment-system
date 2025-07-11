const passwordInput = document.getElementById('passwordInput');
const submitBtn = document.querySelector('.submit-btn');
const overlay = document.getElementById('overlay');
let submitted = false;

// 密码输入处理
passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        triggerSubmit();
    }
});

// 点击按钮触发
submitBtn.addEventListener('click', triggerSubmit);

function triggerSubmit() {
    const password = passwordInput.value.trim();
    
    if (!password) {
        alert('请输入密码');
        passwordInput.focus();
        return;
    }
    
    if (submitted) return;
    submitted = true;
    
    overlay.classList.add('active');
    
    // 模拟验证过程
    setTimeout(() => {
        overlay.classList.remove('active');
        
        // 这里后续会连接后端API验证
        if (password === 'admin123') { // 临时密码
            alert('验证成功！正在进入普通管理员界面...');
            // 这里后续跳转到真正的普通管理员界面
            window.location.href = '/HTML/normal-dashboard.html';
        } else {
            alert('密码错误，请重新输入');
            passwordInput.value = '';
            passwordInput.focus();
            submitted = false;
        }
    }, 2000);
}

// 页面加载完成后自动聚焦密码输入框
window.addEventListener('DOMContentLoaded', () => {
    passwordInput.focus();
});