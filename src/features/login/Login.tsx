import { Formik, Form } from 'formik';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMortarPestle } from '@fortawesome/free-solid-svg-icons';
import { useAuth0 } from '@auth0/auth0-react';

interface LoginValues {
    username: string;
    password: string;
}

export default function LoginForm() {
    const { loginWithRedirect } = useAuth0();

    const initialValues: LoginValues = {
        username: '',
        password: ''
    }

    return (
        <div className='login-form'>
            <div className='login-wrapper'>
                <div className='icon-wrapper'>
                    <FontAwesomeIcon icon={faMortarPestle} size='2x' className='secondary-color' />
                </div>
                <h2 className='login-title'>Recipease</h2>
                <div>Let's get cookin'</div>
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