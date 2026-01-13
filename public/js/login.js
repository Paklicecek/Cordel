const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const glider = document.querySelector('.glider');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');

signupBtn.addEventListener('click', () => {
    glider.style.transform = 'translateX(100%)';
    
    formTitle.textContent = "Create Account"
    submitBtn.value = "Sign Up";
    
    signupBtn.classList.add('active');
    loginBtn.classList.remove('active');
});

loginBtn.addEventListener('click', () => {
    glider.style.transform = 'translateX(0)';
    
    formTitle.textContent = "Welcome Back"
    submitBtn.value = "Sign In";
    
    loginBtn.classList.add('active')
    signupBtn.classList.remove('active')
})