function insert(num) {
    document.form1.textview.value = document.form1.textview.value + num;
}

function equal() {
    let exp = document.form1.textview.value;
    if (exp) {
        document.form1.textview.value = eval(exp);
    }
}

function backspace() {
    let exp = document.form1.textview.value;
    document.form1.textview.value = exp.substring(0, exp.length - 1);
}

function toggleTheme() {
    const body = document.body;
    const theme = body.getAttribute('data-theme');
    body.setAttribute('data-theme', theme === 'dark' ? 'light' : 'dark');
}

// Enable keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (key >= '0' && key <= '9' || key === '.') {
        insert(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        insert(key);
    } else if (key === 'Enter') {
        equal();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape') {
        document.form1.textview.value = '';
    }
});