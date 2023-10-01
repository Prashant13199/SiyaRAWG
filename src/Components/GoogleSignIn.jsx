import React, { useState } from "react";
import { signInWithGoogle } from '../Services/auth';
import "../index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { database } from "../firebase";
import googlelogo from "../Assets/googlelogo.png";

export default function GoogleSignin() {

  const [loading, setLoading] = useState(false);
  const avatarArray = ['Willow', 'Spooky', 'Bubba', 'Lily', 'Whiskers', 'Pepper', 'Tiger', 'Zoey', 'Dusty', 'Simba']

  const signInBtnClick = async () => {
    setLoading(true);
    let userBySignIn = await signInWithGoogle();
    if (userBySignIn) {
      database.ref(`/Users/${userBySignIn.uid}`).on("value", (snapshot) => {
        if (snapshot.val()) {
          localStorage.setItem("uid", userBySignIn.uid);
          localStorage.setItem('username', userBySignIn.email.replace("@gmail.com", ""))
          setLoading(false);
          window.location.reload()
        } else {
          database.ref(`/Users/${userBySignIn.uid}`).update({
            uid: userBySignIn.uid,
            email: userBySignIn.email,
            createdAccountOn: Date.now(),
            photo: `https://api.dicebear.com/6.x/thumbs/png?seed=${avatarArray[Math.ceil(Math.random() * 10)]}`,
            username: userBySignIn.email.replace("@gmail.com", ""),
            timestamp: Date.now(),
          }).then(() => {
            localStorage.setItem("uid", userBySignIn.uid);
            localStorage.setItem('username', userBySignIn.email.replace("@gmail.com", ""))
            setLoading(false);
            window.location.reload()
          }).catch((e) => {
            console.log(e);
          });
        }
      });
    } else {
      setLoading(false)
      console.log('Error')
    }
  };

  return (

    <div className="login__withGoogle" onClick={signInBtnClick}>
      <img src={googlelogo} alt="Google Logo" />
      {!loading ? "Sign in using google" : "Please Wait..."}
    </div>

  );
}