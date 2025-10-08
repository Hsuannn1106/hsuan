// 遊戲API管理
class GameAPI {
    constructor() {
        this.baseURL = 'php/api/';
        this.currentUser = null;
        this.currentGameRecord = null;
    }

    // 創建用戶
    async createUser(username, email) {
        const response = await fetch(this.baseURL + 'user.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, email})
        });
        return await response.json();
    }

    // 獲取用戶資料
    async getUser(userId) {
        const response = await fetch(`${this.baseURL}user.php?id=${userId}`);
        return await response.json();
    }

    // 開始遊戲
    async startGame(userId, gameType) {
        const response = await fetch(this.baseURL + 'game.php?action=start', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_id: userId, game_type: gameType})
        });
        const result = await response.json();
        this.currentGameRecord = result.record_id;
        return result;
    }

    // 結束遊戲
    async endGame(userId, gameType, score, points, duration, completed = true) {
        const response = await fetch(this.baseURL + 'game.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                record_id: this.currentGameRecord,
                user_id: userId,
                game_type: gameType,
                score: score,
                points: points,
                duration: duration,
                completed: completed
            })
        });
        return await response.json();
    }

    // 獲取遊戲紀錄
    async getGameRecords(userId) {
        const response = await fetch(`${this.baseURL}game.php?user_id=${userId}`);
        return await response.json();
    }

    // 獲取排行榜
    async getLeaderboard() {
        const response = await fetch(this.baseURL + 'user.php');
        return await response.json();
    }
}

// 全域API實例
const gameAPI = new GameAPI();