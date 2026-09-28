function validateForm(){
    const name = document.getElementById('name').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const gender = document.getElementById('gender').value.trim();
    const address = document.getElementById('address').value.trim();
    const message = document.getElementById('message').value.trim();

    const namepattern = /^[A-Za-z]+ [A-Za-z]+$/;
    if(!namepattern.test)(name){
        message.innerText= 'Name must be in format <firstname> <lastname>';
        return;

    }
 
    const usernamepattern = /^@w+$/;
    if(!usernamepattern.test)(username){
        message.innerText= 'Name must be in format @<username>';
        return;

    }

    const emailpattern =
    if(!emailpattern.test)(email){
        message.innerText= 'Name must be in format <string>@<string>.<xxx>';
        return;
    }

    const 
}