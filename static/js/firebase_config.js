// Mock Firebase Configuration for Local Demo
const firebaseConfig = {
    apiKey: "AIzao...mock-key",
    authDomain: "mock-project.firebaseapp.com",
    projectId: "mock-project",
    storageBucket: "mock-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

// Mock Auth system
let appAuth = {
    currentUser: null,
    onAuthStateChanged: function(callback) {
        // Mock a listener, returning a dummy user if we want them logged in, else null
        // Change to true to simulate logged in state unconditionally
        const isLoggedIn = localStorage.getItem("mock_logged_in") === "true";
        if (isLoggedIn) {
            callback({ uid: "user123", email: "patient@example.com", displayName: "Patient Demo" });
        } else {
            callback(null);
        }
    },
    signInWithEmailAndPassword: async function(email, password) {
        if(email && password) {
            localStorage.setItem("mock_logged_in", "true");
            return { user: { uid: "user123", email, displayName: "Patient Demo" } };
        }
        throw new Error("Invalid mock credentials");
    },
    createUserWithEmailAndPassword: async function(email, password) {
         if(email && password) {
            localStorage.setItem("mock_logged_in", "true");
            return { user: { uid: "user123", email, displayName: "Patient Demo" } };
         }
         throw new Error("Mock registration failed");
    },
    signOut: async function() {
        localStorage.removeItem("mock_logged_in");
        window.location.href = "/";
    }
};

// Mock Firestore Db
let appDb = {
    collection: function(name) {
        return {
            add: async function(data) {
                console.log("Mock Firestore add to", name, data);
            },
            doc: function(id) {
                return {
                    set: async function(data) {
                        console.log("Mock Firestore set", name, id, data);
                    }
                }
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Update UI based on mock state
    const loginBtns = document.querySelectorAll('.login-btn, .register-btn');
    const userDropdown = document.querySelector('.user-dropdown');
    const userNameDisplay = document.getElementById('user-name-display');
    
    appAuth.onAuthStateChanged((user) => {
        if (user) {
            loginBtns.forEach(btn => btn.classList.add('d-none'));
            if(userDropdown) userDropdown.classList.remove('d-none');
            if(userNameDisplay) userNameDisplay.textContent = user.displayName;
        } else {
            loginBtns.forEach(btn => btn.classList.remove('d-none'));
            if(userDropdown) userDropdown.classList.add('d-none');
        }
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            appAuth.signOut();
        });
    }
});
