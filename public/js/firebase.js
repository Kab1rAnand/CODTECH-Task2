let firebaseConfig = {
    apiKey: "AIzaSyAAjr2xfycg9NBeaqu_Smep486H02MUTIo",
    authDomain: "blogging-website-8dc55.firebaseapp.com",
    projectId: "blogging-website-8dc55",
    storageBucket: "blogging-website-8dc55.appspot.com",
    messagingSenderId: "569969263430",
    appId: "1:569969263430:web:1439594463b5a241b29b47"
};

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
let auth = firebase.auth();

const logoutUser = () => {
    auth.signOut();
    location.reload();
};
