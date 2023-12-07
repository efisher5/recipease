import { Formik, Form } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMortarPestle } from '@fortawesome/free-solid-svg-icons';
import { useAuth0 } from '@auth0/auth0-react';
import loginStyles from './Login.module.css';

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
        <div className={loginStyles.loginForm}>
            <div className={loginStyles.loginWrapper}>
                <div className={loginStyles.iconWrapper}>
                    <FontAwesomeIcon icon={faMortarPestle} size='2x' className='danger-color' />
                </div>
                <h2 className={loginStyles.loginTitle}>Recipease</h2>
                <div>Let's get cookin'</div>
                <Formik initialValues={initialValues} onSubmit={() => loginWithRedirect()}>
                    {() => (
                        <Form>
                            <div className={loginStyles.loginBtnWrapper}>
                                <button className={loginStyles.loginBtn} type="submit">Login</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}