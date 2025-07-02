document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // 簡單的登入驗證（實際應用中應該連接後端API）
    if (username && password) {
        if (username === 'admin' && password === '123456') {
            alert('登入成功！');
            // 跳轉到主頁面
            window.location.href = 'home_page.html';
        } else {
            alert('帳號或密碼錯誤！');
        }
    } else {
        alert('請輸入帳號和密碼！');
    }
});