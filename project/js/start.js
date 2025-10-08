document.querySelector('.start-button').addEventListener('click', function() {
    window.location.href='home_page.html';//按下跳轉到主頁
});
    
document.querySelector('.control-button:first-child').addEventListener('click', function() {
    alert('聲音設定');
});
    
document.querySelector('.control-button:last-child').addEventListener('click', function() {
    alert('選單已開啟');
});