import React, { useEffect } from 'react'

function FacebookSuccess() {
    useEffect(()=>{
        const params=new URLSearchParams(
            window.location.search
        );
        const token=params.get("token");
        if(token){
            localStorage.setItem("token",token);
            window.location.href="/profile";

        }else{
            window.location.href="/";
        }

    },[]);
  return <h2>Logging in with facebook...</h2>
}

export default FacebookSuccess