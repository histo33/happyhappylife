document.getElementById('sellerLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const sellerId = document.getElementById('seller-id').value;
    const sellerPw = document.getElementById('seller-password').value;
    
    // Simple authentication check as requested
    if (sellerId === 'seller' && sellerPw === '1111') {
        window.location.href = 'dashboard.html';
    } else {
        alert('인증 실패: 아이디 또는 비밀번호가 올바르지 않습니다.');
    }
});
