document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('Login Attempt:', { username, password });
    
    // Simple feedback for demonstration
    const button = e.target.querySelector('.login-form__button');
    const originalText = button.textContent;
    
    button.textContent = '로그인 중...';
    button.disabled = true;
    
    setTimeout(() => {
        let countdown = 5;
        button.textContent = `${username}님, 환영합니다! ${countdown}초 후 이동...`;
        
        const timer = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                button.textContent = `${username}님, 환영합니다! ${countdown}초 후 이동...`;
            } else {
                clearInterval(timer);
                window.location.href = '../index.html';
            }
        }, 1000);
    }, 1500);
});

// Add subtle focus effect animation to social buttons
const socialBtns = document.querySelectorAll('.social-btn');
socialBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const provider = btn.textContent;
        alert(`${provider} 계정으로 로그인을 시도합니다.`);
    });
});
