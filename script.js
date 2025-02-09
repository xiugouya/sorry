let peer;
let conn;
let myCount = 0;

// 初始化 Peer 连接
function init() {
    // 自动生成随机ID（实际应用中应该通过URL传递ID）
    peer = new Peer({
        host: '0.peerjs.com',
        port: 443,
        secure: true
    });

    // 等待连接
    peer.on('open', (id) => {
        if (location.hash === '#host') {
            // 主机模式显示自己的ID
            alert('请将以下链接发送给对手：\n' + location.href.replace('#host', '#' + id));
        } else {
            // 加入已有房间
            const hostId = location.hash.substring(1);
            if (hostId) connectToHost(hostId);
        }
    });

    // 处理连接请求
    peer.on('connection', (connection) => {
        conn = connection;
        setupConnection();
    });
}

// 连接主机
function connectToHost(hostId) {
    conn = peer.connect(hostId);
    setupConnection();
}

// 设置连接监听
function setupConnection() {
    conn.on('open', () => {
        // 同步初始数据
        conn.send({ type: 'count', value: myCount });
    });

    conn.on('data', (data) => {
        if (data.type === 'count') {
            document.getElementById('other').textContent = data.value;
        }
    });
}

// 点击事件处理（同时支持鼠标和触摸）
document.getElementById('leftArea').addEventListener('click', handleClick);
document.getElementById('rightArea').addEventListener('click', handleClick);

function handleClick() {
    myCount++;
    document.getElementById('self').textContent = myCount;
    if (conn) conn.send({ type: 'count', value: myCount });
}

// 自动初始化
if (location.hash) {
    init();
} else {
    location.hash = '#host'; // 默认作为主机
    init();
}