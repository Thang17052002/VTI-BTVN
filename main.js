// Hàm fetchData để gửi yêu cầu fetch và xử lý dữ liệu trả về
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    return response.json();
}

function renderLoadingMessage() {
    const contentDiv = document.querySelector('.content');
    contentDiv.innerHTML = '<h1>Loading...</h1>';
}

function renderErrorMessage(error) {
    const contentDiv = document.querySelector('.content');
    contentDiv.innerHTML = `<h1>${error}</h1>`;
}

function generateCard({ id, title, userId, body, name, email, username, phone, albumId, url, thumbnailUrl, completed }) {
    let content = '';
    if (name) { // User Card
        content = `
            <div style='border: 1px solid red'>
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>Username: ${username}</p>
                <p>Phone: ${phone}</p>
                <button onclick='showDetail(${JSON.stringify({ name, email, username, phone })})'>Show Detail</button>
            </div>
        `;
    } else if (id && title && userId) { // ToDo Card
        content = `
            <div style='border: 1px solid red'>
                <p>User ID: ${userId}</p>
                <p>ID: ${id}</p>
                <p>Title: ${title}</p>
                ${completed ? '<p>Completed</p>' : '<p>Not Completed</p>'}
                <button onclick='showDetail(${JSON.stringify({ id, title, userId, completed })})'>Show Detail</button>
            </div>
        `;
    } else if (id && title && albumId && url && thumbnailUrl) { // Photo Card
        content = `
            <div style='border: 1px solid red'>
                <p>Album ID: ${albumId}</p>
                <p>ID: ${id}</p>
                <p>Title: ${title}</p>
                <img src=${url} alt="Photo" width="100" height="100">
                <p>Thumbnail URL: ${thumbnailUrl}</p>
                <button onclick='showDetail(${JSON.stringify({ id, title, albumId, url, thumbnailUrl })})'>Show Detail</button>
            </div>
        `;
    } else if (id && title && userId) { // Post Card
        content = `
            <div style='border: 1px solid red'>
                <p>User ID: ${userId}</p>
                <p>ID: ${id}</p>
                <p>Title: ${title}</p>
                <p>Body: ${body}</p>
                <button onclick='showDetail(${JSON.stringify({ id, title, userId, body })})'>Show Detail</button>
            </div>
        `;
    }
    return content;
}

function renderData(data, cardGenerator) {
    const contentDiv = document.querySelector('.content');
    contentDiv.innerHTML = '';
    data.forEach(item => {
        const card = cardGenerator(item);
        contentDiv.insertAdjacentHTML('beforeend', card);
    });
}

function handleRequest(url, cardGenerator) {
    renderLoadingMessage();
    fetchData(url)
        .then(data => renderData(data, cardGenerator))
        .catch(error => renderErrorMessage(error.message));
}

// Hàm showDetail() được cập nhật để bao gồm nút close
function showDetail(user) {
    const userInfoDiv = document.getElementById('info');
    userInfoDiv.innerHTML = `
        <h2>${user.name || user.title}</h2>
        ${user.email ? `<p><strong>Email:</strong> ${user.email}</p>` : ''}
        ${user.username ? `<p><strong>Username:</strong> ${user.username}</p>` : ''}
        ${user.phone ? `<p><strong>Phone:</strong> ${user.phone}</p>` : ''}
        ${user.albumId ? `<p><strong>Album ID:</strong> ${user.albumId}</p>` : ''}
        ${user.url ? `<img src=${user.url} alt="Photo" width="100" height="100">` : ''}
        ${user.thumbnailUrl ? `<p><strong>Thumbnail URL:</strong> ${user.thumbnailUrl}</p>` : ''}
        ${user.completed !== undefined ? `<p><strong>Completed:</strong> ${user.completed}</p>` : ''}
        <button onclick='closeDetail()'>Close</button>
    `;
    document.getElementById('modal').style.display = 'block';
}

// Hàm closeDetail() để đóng modal khi nhấn nút close trong thông tin chi tiết
function closeDetail() {
    document.getElementById('modal').style.display = 'none';
}

// Hàm close() vẫn được sử dụng để đóng modal từ bất kỳ nơi nào
function close() {
    document.getElementById('modal').style.display = 'none';
}

// Add event listener to close modal when clicking outside of it
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        close();
    }
});

// Add event listener to close modal when clicking the close button
document.getElementById('closeButton').addEventListener('click', close);

// Usage functions...


// Usage

function handleUser() {
    handleRequest('https://jsonplaceholder.typicode.com/users', generateCard);
}

function handleTodo() {
    handleRequest('https://jsonplaceholder.typicode.com/todos', generateCard);
}

function handlePhoto() {
    handleRequest('https://jsonplaceholder.typicode.com/photos', generateCard);
}

function handleAlbum() {
    handleRequest('https://jsonplaceholder.typicode.com/albums', generateCard);
}

function handlePost() {
    handleRequest('https://jsonplaceholder.typicode.com/posts', generateCard);
}
