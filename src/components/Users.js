import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';


const Users = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();    // to cancel request if component unmounts 

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal //allows cancellation of request if needed
                });
                console.log(response.data); 
                isMounted && setUsers(response.data); 

            } catch(err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true}); // takes location user comes from and sends user back to where they were
            }
        }

        getUsers();

        // Cleanup function of useEffect: runs as component unmounts
        return () => {
            isMounted = false;
            controller.abort(); //cancels requests 
        }
    }, [])

  return (
    <article>
        <h2> Users List</h2>

        {users?.length
            ? (
                <ul>
                    {users.map((user, index) => <li key={index}> {user?.username}</li>)}
                </ul>
            ) : <p> No users to display </p>
        }
    </article>
  )
}

export default Users