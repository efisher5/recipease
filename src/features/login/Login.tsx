import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMortarPestle } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

interface LoginValues {
    username: string;
    password: string;
}

export default function LoginForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loginWithRedirect } = useAuth0();

    const initialValues: LoginValues = {
        username: '',
        password: ''
    }

    const handleSubmit = (values: LoginValues) => {
        console.log(values);
        
    }

    return (
        <div className='login-form'>
            <div className='login-wrapper'>
                <div className='icon-wrapper'>
                    <FontAwesomeIcon icon={faMortarPestle} size='2x' className='secondary-color' />
                </div>
                <h2 className='login-title'>Welcome to Recipease!</h2>
                <Formik initialValues={initialValues} onSubmit={() => loginWithRedirect()}>
                    {() => (
                        <Form>
                            <div className='login-btn-wrapper'>
                                <button className='login-btn' type="submit">Login</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}