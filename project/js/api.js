// 簡化 API
function updatePoints(username, points) {
    const form = new FormData();
    form.append('action', 'updatePoints');
    form.append('username', username);
    form.append('points', points);
    
    fetch('../php/api/user.php', {
        method: 'POST',
        body: form
    });
}

function getPoints(username) {
    return fetch(`../php/api/user.php?action=getPoints&username=${username}`)
        .then(r => r.json());
}