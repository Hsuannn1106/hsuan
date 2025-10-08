document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  fetch('login.php', {
    method: 'POST',
    body: formData
  })
  .then(res => res.text())
  .then(response => {
    if (response === 'success') {
      alert('登入成功！');
      window.location.href = 'home_page.html';
    } else {
      alert('帳號或密碼錯誤');
    }
  })
  .catch(error => {
    alert('系統錯誤');
    console.error(error);
  });
});
