import React, { Component } from 'react'
import { connect } from 'react-redux'

import { login } from '../../actions/UserActions'

import s from './signInForm.pcss'

import Input from '../../components/common/Input/Input'
import Button from '../../components/common/Button/Button'
import Checkbox from '../../components/common/Checbox/Checkbox'

class SignInForm extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            email: this.props.email || '',
            password: this.props.password || '',
            emailError: false,
            passwordError: false,
            isChecked: false
        };
    }

    handleEmailChange(e) {
        this.setState({ email: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    handleCheckBoxChange() {
        this.setState({
            isChecked: !this.state.isChecked
        })
    }

    handleSubmit(e) {
        e.preventDefault();

        const { dispatch } = this.props;
        const { state } = this;
        const mailRegExp = /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z]|digital|xxx)|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        let errors = false;

        this.setState({
            emailError: false,
            passwordError: false
        });

        if (state.password === '') {
            errors = true;
            this.setState({ passwordError: true });
        }

        if (!mailRegExp.test(state.email)) {
            errors = true;
            this.setState({ emailError: true });
        }

        if (!errors) {
            dispatch(login({
                username: state.email,
                password: state.password,
                isChecked: state.isChecked
            }));

            this.setState({
                email: '',
                password: '',
                isChecked: false
            })
        }
    }

    render() {
        const { email, emailError, password, passwordError, isChecked } = this.state;

        return (
            <div className={ s.signInForm }>

                <div className={ s.formWrapper }>
                    <h2>Sign In</h2>

                    <form className={ s.form } onSubmit={ ::this.handleSubmit }>
                        <Input
                            type="email"
                            placeholder="email"
                            name="email"
                            onChange={ ::this.handleEmailChange }
                            value={ email }
                            err={ emailError }/>
                        <Input
                            type="password"
                            placeholder="password"
                            name="password"
                            onChange={::this.handlePasswordChange}
                            value={ password }
                            err={ passwordError }/>
                        <Checkbox
                            text="Это не моё пальто"
                            value={ isChecked }
                            onChange={::this.handleCheckBoxChange}/>
                        <Button type="submit">Sign in</Button>
                    </form>
                </div>

            </div>
        )
    }
}

export default connect(() => ({}))(SignInForm)