<template>
    <!-- <div class="container login-container">
        <div class="row">
            <div class="col-md-6 login-form-1">
                <h3>Travel Agency's Login</h3>
                <hr>
                <form>
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="Your Email *" v-model="email" />
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control" placeholder="Your Password *" v-model="password" />
                    </div>
                    <div class="form-group">
                        <input @click="login" class="btnSubmit" value="Login" />
                    </div>
                    <div class="form-group">
                        <a href="#" class="ForgetPwd">Forget Password?</a>
                    </div>
                    <div class="form-group">
                        <p>Don't have an account? <a href="#" @click="register" class="ForgetPwd"> Register</a></p>
                    </div>
                </form>
            </div>
        </div>
    </div> -->
    <div class="sidenav">
        <div class="login-main-text">
            <h2>FantaSea for travel agency<br> Login Page</h2>
            <p>Login or register from here to access.</p>
        </div>
    </div>
    <div class="main">
        <div class="col-md-6 col-sm-12" v-show="!showRegister">
            <div class="login-form">
                <img class="rounded" src="https://firebasestorage.googleapis.com/v0/b/fantasea-4140a.appspot.com/o/app_media%2Ffantasea.png?alt=media&token=334feb29-1f3b-49a2-96f5-2a57a3b42b3b"> 
                <h4>Login to your account.</h4>
                <form>
                    <div class="form-group">
                        <label>User Name</label>
                        <input type="text" class="form-control" placeholder="Email" v-model="email">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" class="form-control" placeholder="Password" v-model="password">
                    </div>
                    <button type="submit" class="btn btn-black" @click="login">Login</button>
                    <button type="submit" class="btn " @click="showRegister = true">Register</button>
                </form>
            </div>
        </div>
        <div class="col-md-6 col-sm-12" v-show="showRegister">
            <div class="register-form">
                <h4>Create your account.</h4>
                <form>
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="Your Email *" v-model="email" />
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control" placeholder="Your Password *" v-model="password" />
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="Agency Name *" v-model="name" />
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="Number *" v-model="contact" />
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="Street *" v-model="street" />
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="City *" v-model="city" />
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="Province *" v-model="province" />
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="Postal Code *" v-model="postal" />
                    </div>
                    <button type="submit" class="btn" @click="showRegister = false">Already have an account?</button>
                    <button type="submit" class="btn btn-primary" @click.prevent="signUp(name)">Sign Up</button>
                </form>

            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref,set} from "firebase/database";

export default {
    name: 'login',
    data() {
        return {
            email: '',
            name: '',
            contact: '',
            province: '',
            postal: '',
            street: '',
        }
    },
    async beforeCreate() {
        onAuthStateChanged(getAuth(), (user) => {
            if (user) {
                this.$router.push('/')
            }
            else {
                this.$router.push('/login')
            }
        });
    },
    methods: {
        async login() {            
            if (this.email == null || this.email == "" || this.password == null || this.password == "") {
                alert('Some Fields Are Missing')
                return;
            }
            signInWithEmailAndPassword(getAuth(), this.email, this.password)
                .then(() => {
                    console.log("user is now logged in");
                    this.$router.push('/')
                })
                .catch((error) => {
                    switch (error.code) {
                        case 'auth/user-not-found':
                            alert("Incorrect Email or Password")
                            break
                        case 'auth/invalid-email':
                            alert("Invalid email")
                            break
                        case 'auth/wrong-password':
                            alert("Incorrect Email or Password")
                            break
                        default:
                            alert("Something went wrong: " + error.code)
                    }
                });
        },
        async signUp(id) { // create user in Authentication Database
          const db = getDatabase();
            if (this.email == "" || this.password == "" || this.name == "" ||
                this.contact == "" || this.street == "" || this.city == "" || this.province == "" || this.postal == ""
            ) {
                alert('Some Fields Are Missing')
                return;
            }

            createUserWithEmailAndPassword(getAuth(), this.email, this.password)
                .then(() => {
                    this.userId = getAuth().currentUser.uid;
                    set(ref(db, '/users/travel_agency/' + this.userId), {
                        email: this.email,
                        name: this.name,
                        contact_number: this.contact,
                        address: this.street + ", " + this.city + ", " + this.province + ", " + this.postal,
                        user_type: 'agency',
                    })
                        .then(() => {
                            alert("Succesfully Registered")
                        })
                        .catch((error) => {
                            alert("error" + error.message)
                        });
                })
                .catch((error) => {
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            alert("Email already in use")
                            break
                        case 'auth/invalid-email':
                            alert("Invalid email")
                            break
                        case 'auth/operation-not-allowed':
                            alert("Operation not allowed")
                            break
                        case 'auth/weak-password':
                            alert("Weak password : Password should be 6 characters up")
                            break
                        default:
                            alert("Something went wrong" + error.message)
                    }
                });
        },
    }
}
</script>
<style scoped>
.main-head {
    height: 150px;
    background: #FFF;

}

.sidenav {
    height: 100%;
    background-image: linear-gradient(rgb(69, 206, 234), rgb(231, 153, 63));
    overflow-x: hidden;
    padding-top: 20px;
}

.login-form {
    text-align: left;
}

.register-form {
    text-align: left;
}

.main {
    padding: 0px 10px;
}

@media screen and (max-height: 450px) {
    .sidenav {
        padding-top: 15px;
    }
}

@media screen and (max-width: 450px) {
    .login-form {
        margin-top: 10%;
    }

    .register-form {
        margin-top: 10%;
    }
}

@media screen and (min-width: 768px) {
    .main {
        margin-left: 40%;
    }

    .sidenav {
        width: 40%;
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
    }

    .login-form {
        margin-top: 50%;
    }

    .register-form {
        margin-top: 20%;
    }
}


.login-main-text {
    margin-top: 10%;
    padding: 60px;
    color: #fff;
}

.login-main-text h2 {
    font-weight: 300;
}

.btn-black {
    background-color: rgb(93, 168, 237) !important;
    color: #fff;

}

.btn {
    margin-top: 10px;
    margin-right: 10px;
}

.form-group {
    margin-top: 2%;
}
.rounded{
    border-radius: 50%;
    height: 100%;
    width: 150px;
}
</style>