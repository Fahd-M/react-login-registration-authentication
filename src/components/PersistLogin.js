import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh(); //reaches to endpoint and takes cookie with it, then endpoint sends back new access token before we get to requireAuth component that kicks user out
            } catch (err) {
                console.error(err);
            } finally {
                isMounted && setIsLoading(false);
            }
        }
        // Avoids unwanted call to verifyRefreshToken
        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [])

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`)
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
    }, [isLoading])
    
    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p> Loading...</p>
                    : <Outlet /> 
            }
        </>
    )
}

export default PersistLogin;