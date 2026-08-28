import { useEffect } from 'react';

function LinkedInSuccess() {
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
    return <h2>Logging in with LinkedIn.....</h2>;
  }

export default LinkedInSuccess