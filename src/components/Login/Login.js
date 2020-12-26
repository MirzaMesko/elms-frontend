import React from 'react';
import styled from 'styled-components';

const LoginForm = styled.div`
    margin: 200px auto;
    text-align: center;
    width: 300px;
    border: 2px solid rgb(84, 163, 233);
    box-shadow: 10px 10px 15px #aaaaaa;
`;

const Field = styled.input`
    display: block;
    margin: 20px auto;
    width: 200px;
    height: 30px;
`;

const LoginConfirm = styled.button`
    display: block;
    margin: 20px auto;
    width: 100px;
    height: 30px;
`;



class Login extends React.Component {
    state = {
        username: '',
        password: '',
    }

    handleUsernameChange = (event) => {
        this.setState({ username: event.target.value})
    }

    handlePasswordChange = (event) => {
        this.setState({ password: event.target.value})
    }

    login = () => {
        const { username, password } = this.state;
        this.props.onLogin(username, password)
    }

    render() {
        return (
            <LoginForm>
                <p>Please log in to continue!</p>
                <Field placeholder='username' type='text' onChange={this.handleUsernameChange} value={this.state.username} />
                <Field placeholder='password' type='password' onChange={this.handlePasswordChange} value={this.state.password} />
                <LoginConfirm onClick={this.login} >Log in</LoginConfirm>
            </LoginForm>
        )
    }
}

export default Login;