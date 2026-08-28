import { useEffect } from 'react';

function GithubSuccess() {
    useEffect(()=>{
        const params=new URLSearchParams(window.location.search);
        const token=params.get("token");
        if(token){
            localStorage.setItem("token",token);
            window.location.href="/profile";
        }else{
            window.location.href="/";
        }
    },[]);
  return <h2>Github Login Success</h2>;
}

export default GithubSuccess