
// import {axios} from 'axios';
// import { showAlert } from './alerts';

const login = (email, password) => {
    alert({email, password});
    console.log(email, password);
};

// const axios = require('axios');

login.exports = async (email, password) => {
    // alert(email, password )
    // console.log(email, password);
    try {
        // const res= await axios({
        const res= await ({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/login',
            data: {
                email,
                password
            }
        }); 
        
            console.log(res);

    //         if (res.data.status === 'success') {
    //             showAlert('success', 'Logged in successfully!');
    //             window.setTimeout(() => {
    //                 location.assign('/');
    //             }, 1500);
    //         }
    } catch (err) {
        console.log(err.response.data);
    }
    };

document.querySelector('.form').addEventListener('submit', e => {
    // prevent loading other pages
    e.preventDefault();             
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});