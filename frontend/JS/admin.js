// 管理员页面功能
function logout() {
    if (confirm('确定要注销登录吗？')) {
        // 清除可能的用户信息
        console.log('用户注销');
        // 返回首页
        window.location.href = '/';
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('管理员页面已加载');
});