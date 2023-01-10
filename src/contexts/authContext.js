//Implementation for authenticating users
import React, { useContext, useEffect, useState } from 'react'
//importing auth module from the firebase.js file. Used to log in a user
import { auth } from '../firebase'; 

const AuthContext = React.createContext();

//function that helps us use the context
export function useAuth(){
  return useContext(AuthContext)
}

export function AuthProvider({children}) {
  //The useState hook is used for storing variables that are part of your application's state and will change as the user interacts with your website.
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  //Helps a user signup
  function signup(email, password){
    // authenticating with firebase (change only this line if using another database)
    return auth.createUserWithEmailAndPassword(email, password);
  }
  //Helps a user log in
  function login (email, password){
    // authenticating with firebase
    return auth.signInWithEmailAndPassword(email, password);
  }

  //Helps a user log out
  function logout(){
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }
  
  useEffect(() => {
    //Whenever a new user signs-in, they are set as the current User automatically
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false) 
    })

    //Unsubscribes us from the 'onAuthStateChanged' listener
    return unsubscribe //Note: the onAuthStateChanged method returns a method, so when we call that method (like we did here) it'll automatically unsubscribe the onAuthStateChanged event
  }, [])

 
  //'value' is going to hold all the info. we want to provide with our authentication.
  const value = { 
    currentUser,
    login,
    signup,
    logout,
    resetPassword
  }
     
  // returning the currentUser in the provider so that we can use it anywhere in our app
  return (
    <AuthContext.Provider value={value}>
      {/* if we're not loading, then render children, else dont render children */}
      {!loading && children} 
    </AuthContext.Provider>
  )
}