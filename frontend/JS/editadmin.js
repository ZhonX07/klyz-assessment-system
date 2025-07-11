const inputs = document.querySelectorAll('.otp-container input');
const btn = document.querySelector('.submit-btn');
const overlay = document.getElementById('overlay');
let submitted = false;

// 输入 & 跳转 & 数字校验
inputs.forEach((input, idx) => {
    input.addEventListener('input', e => {
        e.target.value = e.target.value.replace(/\D/g, '');
        if (e.target.value && idx < inputs.length - 1) {
            inputs[idx + 1].focus();
        }
        if (isComplete()) triggerSubmit();
    });
    
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            triggerSubmit();
            return;
        }
        if (e.key === 'Backspace' && !e.target.value && idx > 0) {
            inputs[idx - 1].focus();
        }
    });
});

// 点击按钮触发
btn.addEventListener('click', triggerSubmit);

function isComplete() {
    return Array.from(inputs).every(i => /^\d$/.test(i.value));
}

function triggerSubmit() {
    if (submitted || !isComplete()) return;
    submitted = true;
    overlay.classList.add('active');
    
    // 模拟验证过程
    setTimeout(() => {
        overlay.classList.remove('active');
        const code = Array.from(inputs).map(i => i.value).join('');
        
        // 这里后续会连接后端API验证
        if (code === '123456') { // 临时验证码
            alert('验证成功！正在进入编辑管理员界面...');
            // 这里后续跳转到真正的编辑管理员界面
            window.location.href = '/HTML/edit-dashboard.html';
        } else {
            alert('验证码错误，请重新输入');
            inputs.forEach(input => input.value = '');
            inputs[0].focus();
            submitted = false;
        }
    }, 2000);
}

// 页面加载完成后自动聚焦第一个输入框
window.addEventListener('DOMContentLoaded', () => {
    inputs[0].focus();
});