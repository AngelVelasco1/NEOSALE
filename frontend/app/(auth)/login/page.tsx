import { LoginForm } from '../components/LoginForm';
import { Suspense } from 'react';

const Login = () => {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Cargando...</div>}>
            <LoginForm />
        </Suspense>
    )
}
export default Login;
