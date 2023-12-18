import { useState } from "react"
import http from "../../libs/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {

          
        //   console.log('CSRF', csrf);
          
        await http.get('/sanctum/csrf-cookie');

        console.log(email, password);
        
        
        const login = await http.post('/api/login', { email, password });

        console.log('LOGIN: ', login);

        const {data} = await http.get('/api/user');

        console.log('USER: ', data);
                   
        // navigate('/jobs')  

        } catch (error) {
            console.log(error);         
        }
    }

  return (
    <>
        <form onSubmit={handleLogin}>
            <input type="email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">lOGIN</button>
        </form>
    </>
  )
}

export default Login