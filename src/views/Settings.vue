<template>
    <div class="container-fluid">
        <div class="row">
            <nav class="col-md-2 d-none d-md-block bg-light sidebar">
                <div class="sidebar-sticky">
                    <h6
                        class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                        <span>Account Settings</span>
                        <a class="d-flex align-items-center text-muted" href="#">
                            <span data-feather="plus-circle"></span>
                        </a>
                    </h6>
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link" @click="openGeneralTab">
                                General
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" @click="openPasswordTab">

                                Password
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" @click="openSocialTab">
                                Social Medias
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" @click="openReportTab">
                                Reports
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" @click="openTransactionTab">
                                Transactions
                            </a>
                        </li>
                    </ul>


                </div>
            </nav>

            <main role="main" class="mainColumn">
                <div class="col-md-9">
                    <div class="tab-content">

                        <div class="tab-pane fade active show" id="account-general" v-show="isGenTab">

                            <div class="card-body media align-items-center">
                                <img :src="previewImage" alt="profilepic" class="d-block ui-w-80">
                                <div class="media-body ml-4">
                                    <label class="btn btn-outline-primary">
                                        Upload new photo
                                        <input type="file" class="account-settings-fileinput" ref="fileInput"
                                            @input="pickFile">

                                    </label> &nbsp;
                                    <button type="button" class="btn btn-default md-btn-flat"
                                        @click="ResetButton">Reset</button>

                                    <div class="text-light small mt-1">Allowed JPG or PNG</div>
                                </div>
                            </div>
                            <hr class="border-light m-0">

                            <div class="card-body">
                                <div class="form-group">
                                    <label class="form-label">Agency Name</label>
                                    <input type="text" class="form-control mb-1" disabled v-model="username">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Address</label>
                                    <input type="text" class="form-control" v-model="address">
                                    <label class="form-label" style="font-size:12px;"># Street, City, Province,
                                        Postal</label>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Email</label>
                                    <input type="text" class="form-control mb-1" disabled v-model="email">
                                    <div class="alert alert-warning mt-3" v-if="!isVerified">
                                        Your email is not confirmed. Please check your inbox.<br>
                                        <a href="javascript:void(0)" @click.prevent="sendVerification">Resend
                                            confirmation</a>
                                    </div>
                                    <div class="alert alert-warning mt-3" style="background-color:lightgreen" v-else>
                                        <p style="color:green">Email is Verified</p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Contact number</label>
                                </div>

                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">+63</span>
                                    </div>
                                    <input type="text" class="form-control" v-model="number">
                                </div>
                            </div>

                            <div class="text-right mt-3">
                                <button type="button" class="btn btn-primary" @click.prevent="updateInfo">Save
                                    changes</button>&nbsp;
                                <button type="button" class="btn btn-default">Cancel</button>
                            </div>

                        </div> <!-- General Tab -->

                        <div class="card-body media align-items-center" v-show="isPassTab">
                            <h2> Password Settings </h2>
                        </div>

                        <div class="tab-pane fade active show" v-show="isPassTab">

                            <div class="card-body">
                                <div class="form-group">
                                    <label class="form-label">Current Password</label>
                                    <input type="text" class="form-control mb-1" v-model="current_password">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">New Password</label>
                                    <input type="text" class="form-control" v-model="input_password">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Confirm Password</label>
                                    <input type="text" class="form-control" v-model="new_password">
                                </div>
                            </div>

                            <div class="text-right mt-3">
                                <button type="button" class="btn btn-primary" @click="savePassword">Save
                                    changes</button>&nbsp;
                                <button type="button" class="btn btn-default" @click="cancelPassword">Cancel</button>
                            </div>

                        </div><!-- Password Tab -->

                        <div class="card-body media align-items-center" v-show="isSocialTab">
                            <h2> Social Media Links </h2>
                        </div>


                        <div class="tab-pane fade active show" v-show="isSocialTab">

                            <div class="card-body">
                                <div class="form-group">
                                    <label class="form-label">Facebook</label>
                                    <input type="text" class="form-control mb-1" v-model="social_facebook_link">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Instagram</label>
                                    <input type="text" class="form-control" v-model="social_instagram_link">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Twiiter</label>
                                    <input type="text" class="form-control" v-model="social_twitter_link">
                                </div>
                            </div>

                            <div class="text-right mt-3">
                                <button type="button" class="btn btn-primary" @click.prevent="updateSocial">Save
                                    changes</button>&nbsp;
                                <button type="button" class="btn btn-default">Cancel</button>
                            </div>


                        </div><!-- Social Media Tab -->

                        <div class="card-body media align-items-center" v-show="isReportTab">
                            <h2>Report</h2>
                        </div>

                        <div class="tab-pane fade active show" v-show="isReportTab">

                            <div class="card-body">

                                <div class="form-group">
                                    <label class="form-label">Subject</label>
                                    <input type="text" class="form-control mb-1" v-model="report_subject">
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Report</label>
                                    <textarea class="form-control" rows="5" v-model="report_content"></textarea>
                                </div>
                            </div>

                            <div class="text-right mt-3">
                                <button type="button" class="btn btn-primary"
                                    @click.prevent="submitReport">Submit</button>
                            </div>

                        </div><!-- Report Tab -->

                        <div class="tab-pane fade active show" v-show="isTransactionTab">

                            <h2>Transactions</h2>

                            <h4 style="text-align:left">Pendings</h4>
                            <div class="table-responsive-xl">
                                <table class="table table-bordered table-sm">
                                    <thead class="thead-dark">
                                        <th>
                                            #
                                        </th>
                                        <th>Destination Name </th>
                                        <th>Destination Province</th>
                                        <th> Scheduled Date </th>
                                        <th> Date Booked </th>
                                        <th>Boat Name</th>
                                        <th> Boat Capacity </th>
                                        <th>Activities</th>
                                        <th> Customer Name </th>
                                        <th> Amount </th>
                                        <th> Payment Reference</th>
                                        <th>Actions</th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="pending in pendingList" :key="pending.key">
                                            <td>
                                                {{ pending.id }}
                                            </td>
                                            <td>{{ pending.destination_name }}</td>
                                            <td>{{ pending.destination_province }}</td>
                                            <td>{{ pending.scheduled_date }}</td>
                                            <td>{{ pending.transaction_date }}</td>
                                            <td>
                                                <a @click.prevent="messageBoat(pending.boat_name)">
                                                    {{ pending.boat_name }}
                                                </a>
                                            </td>
                                            <td>{{ pending.boat_capacity }}</td>
                                            <td>{{ pending.destination_activities }}</td>
                                            <td>
                                                <a @click.prevent="messageCustomer(pending.customer_name)">
                                                    {{ pending.customer_name }}
                                                </a>
                                            </td>
                                            <td>{{ pending.price }}</td>
                                            <td>{{ pending.payID }}</td>
                                            <td>
                                                <button class="table-btn"
                                                    @click.prevent="approveBooking(pending.id,pending.destination_name, pending.destination_province, pending.scheduled_date,
                                                    pending.transaction_date, pending.boat_name, pending.boat_capacity,
                                                    pending.customer_name, pending.price, pending.payID, pending.destination_activities)"
                                                    style="background-color:green">
                                                    Approve
                                                </button>
                                            </td>                                         
                                        </tr>
                                    </tbody>
                                </table>

                                <h4 style="text-align:left">Bookings</h4>
                                <table class="table">
                                    <thead>
                                        <th>
                                            Reference ID
                                        </th>
                                        <th>Destination Name </th>
                                        <th>Destination Province</th>
                                        <th> Scheduled Date </th>
                                        <th> Date Booked </th>
                                        <th>Boat Name</th>
                                        <th> Boat Capacity </th>
                                        <th>Activities</th>
                                        <th> Customer Name </th>
                                        <th> Amount </th>
                                        <th> Payment Reference</th>
                                        <th>ticketStatus</th>
                                        <th>Actions</th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="booking in bookingList" :key="booking.key">
                                            <td>{{ booking.reference_id }}</td>
                                            <td>{{ booking.destination_name }}</td>
                                            <td>{{ booking.destination_province }}</td>
                                            <td>{{ booking.scheduled_date }}</td>
                                            <td>{{ booking.transaction_date }}</td>
                                            <td>{{ booking.boat_name }}</td>
                                            <td>{{ booking.boat_capacity }}</td>
                                            <td>{{ booking.destination_activities }}</td>
                                            <td>{{ booking.customer_name }}</td>
                                            <td>{{ booking.price }}</td>
                                            <td>{{ booking.payID }}</td>
                                            <td>
                                                <button
                                                    v-if="booking.ticketStatus == 'Ongoing' || booking.ticketStatus == 'Completed'"
                                                    :class="(booking.ticketStatus == 'Ongoing' ? 'ongoing_status' : 'complete_status')">{{
                                                            booking.ticketStatus
                                                    }} </button>
                                                <button v-else class="cancel_status">
                                                    {{
                                                            booking.ticketStatus
                                                    }}
                                                </button>
                                            </td>
                                            <td><button class="table-btn"
                                                    @click.prevent="completeTicket(booking.reference_id, booking.payID, booking.ticketStatus)">Done</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <!-- Bookings Table -->
                                <h4 style="text-align:left">Advertised Destination</h4>
                                <table class="table table-bordered table-sm">
                                    <thead>
                                        <th>#</th>
                                        <th>Destination</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Amount</th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="promo, index in promoList" :key="promo.key">
                                            <td>{{ index + 1 }}</td>
                                            <td>{{ promo.destination_name }}</td>
                                            <td>{{ promo.date_purchased }}</td>
                                            <td>{{ promo.time_purchased }}</td>
                                            <td>{{ promo.amount }} $</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <!-- Promo Table -->
                            </div>


                        </div><!-- Transaction Tab -->

                    </div>
                </div>


            </main>
        </div>
    </div>

</template>

<script>
/* eslint-disable */
import { getDatabase, ref, get, onValue, child, update, push, set, remove } from "firebase/database";
import { getAuth, onAuthStateChanged, sendEmailVerification, updatePassword } from 'firebase/auth'
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default {
    name: 'edit-profile',
    data() {
        return {
            isGenTab: true,
            isPassTab: '',
            isReportTab: '',
            isSocialTab: '',
            isTransactionTab: '',
            username: '',
            previewImage: null,
            address: '',
            email: '',
            number: '',
            imageName: '',
            imageData: '',
            date: '',
            time: '',
            report_content: '',
            report_subject: '',
            pendingList: [],
            promoList: [],
            bookingList: [],
            new_password: '',
            input_password: '',
            isVerified: false,
        };
    },
    mounted() {
        const db = getDatabase();
        const dbRef = ref(db);
        const storage = getStorage();
        this.date = this.getDate();
        this.time = this.getTime();
        this.currentYear = this.getCurrentYear();
        onAuthStateChanged(getAuth(), (user) => {
            if (user) {
                this.userId = user.uid;
                //get logged in user
                get(child(dbRef, '/users/travel_agency/' + this.userId)).then((snapshot) => {
                    if (snapshot.exists()) {

                        this.username = snapshot.val().name;
                        this.agency_name = snapshot.val().name;
                        this.previewImage = snapshot.val().profile_pic;
                        this.address = snapshot.val().address;
                        this.email = snapshot.val().email;
                        this.number = snapshot.val().contact_number;
                        this.social_facebook_link = snapshot.val().fb_link;
                        this.social_instagram_link = snapshot.val().insta_link;
                        this.social_twitter_link = snapshot.val().twitter_link;

                    }
                }); // end Get Child

                //get all pendings 
                let viewPending = this;
                const pendingRef = ref(db, '/Pending/');
                onValue(pendingRef, (snapshot) => {
                    let data = snapshot.val();
                    let pendingList = [];
                    Object.keys(data).forEach((key) => {
                        if (data[key].agency_name == this.$route.params.id) {
                            pendingList.push({
                                id: key,
                                customer_name: data[key].username,
                                boat_name: data[key].boat_name,
                                scheduled_date: data[key].date_sched,
                                transaction_date: data[key].date_sent,
                                price: data[key].base_price,
                                destination_name: data[key].destination_name,
                                destination_province: data[key].destination_province,
                                destination_activities: data[key].activities,
                                boat_capacity: data[key].capacity,
                                payID: data[key].payID,
                            })
                        }
                        viewPending.pendingList = pendingList;
                    });
                });

                //get all Promoted Destination
                let viewPromo = this;
                const promoRef = ref(db, '/transactions/' + this.userId);
                onValue(promoRef, (snapshot) => {
                    let data = snapshot.val();
                    let promoList = [];
                    Object.keys(data).forEach((key) => {

                        promoList.push({
                            agency_name: data[key].agency_name,
                            amount: data[key].amount,
                            date_purchased: data[key].date_purchased,
                            days: data[key].days,
                            destination_name: data[key].destination_name,
                            time_purchased: data[key].time_purchased,
                        })

                    })
                    viewPromo.promoList = promoList;
                })

                // get all Bookings
                let viewBooking = this;
                const bookingRef = ref(db, '/boatbooking/');
                onValue(bookingRef, (snapshot) => {
                    let data = snapshot.val();
                    let bookingList = [];
                    Object.keys(data).forEach((key) => {
                        console.log(key)
                        if (data[key].agency_name == this.$route.params.id) {
                            bookingList.push({
                                reference_id: key,
                                customer_name: data[key].customer_name,
                                boat_name: data[key].pump_boat_name,
                                scheduled_date: data[key].date_scheduled,
                                transaction_date: data[key].date_booked,
                                price: data[key].price,
                                destination_name: data[key].destination_name,
                                destination_province: data[key].destination_province,
                                destination_activities: data[key].activities,
                                boat_capacity: data[key].seating_capacity,
                                payID: data[key].payID,
                                ticketStatus: data[key].ticketStatus,
                            });
                        }
                        viewBooking.bookingList = bookingList;
                    })
                })
                if (user.emailVerified == true) {
                    this.isVerified = true;
                } else {
                    this.isVerified = false;
                }
            } //end if User 
            else {
                this.$router.push('/login')
            }
        })
    },
    methods: {
        //method for select file image
        async pickFile() {
            let input = this.$refs.fileInput
            let file = input.files
            if (file && file[0]) {
                let reader = new FileReader
                reader.onload = e => {
                    this.previewImage = e.target.result
                }
                reader.readAsDataURL(file[0])
                this.$emit('input', file[0])
                console.log("file name: " + file[0].name)
                this.imageName = file[0].name;
                this.imageData = file[0];
            }
        },

        async ResetButton() {
            this.previewImage = "";
        },
        //method for navigating sidemenu tabs
        async openGeneralTab() {

            this.isGenTab = true;
            this.isPassTab = false;
            this.isReportTab = false;
            this.isSocialTab = false;
            this.isTransactionTab = false;

        },
        async openPasswordTab() {

            this.isPassTab = true;
            this.isGenTab = false;
            this.isReportTab = false;
            this.isSocialTab = false;
            this.isTransactionTab = false;

        },
        async openReportTab() {

            this.isGenTab = false;
            this.isPassTab = false;
            this.isReportTab = true;
            this.isSocialTab = false;
            this.isTransactionTab = false;
        },

        async openSocialTab() {

            this.isGenTab = false;
            this.isPassTab = false;
            this.isReportTab = false;
            this.isSocialTab = true;
            this.isTransactionTab = false;
        },
        async openTransactionTab() {
            this.isTransactionTab = true
            this.isGenTab = false;
            this.isPassTab = false;
            this.isReportTab = false;
            this.isSocialTab = false;
        },//end navigate side menu method

        async updateInfo() {
            const db = getDatabase();
            const dbRef = ref(db);
            const storage = getStorage();
            if (this.username == "" || this.address == "" || this.number == ""
                || this.previewImage == "" || this.previewImage == null ||
                this.address == null || this.number == null) {
                alert("Some Fields Are Empty");
                return;
            }
            if (this.number < 12) {
                alert("Invalid number");
                return;
            } // end Validator

            onAuthStateChanged(getAuth(), (user) => {
                this.userId = user.uid
            }); // end authState  
            const storageRef = sRef(storage, '/travel_agency/' + this.username + '/profile/' + this.imageName);
            const uploadTask = uploadBytesResumable(storageRef, this.imageData);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        this.previewImage = downloadURL;
                        update(ref(db, '/users/travel_agency/' + this.userId), {
                            address: this.address,
                            contact_number: this.number,
                            pic_name: this.imageName,
                            profile_pic: this.previewImage,
                        }).then(() => {
                            console.log("update success: ")
                            alert('Updated')
                        })
                            .catch((error) => {
                                console.log("update failed: " + error)
                            }); //end Update                   
                    });
                }
            );
        },//end updateMethod

        async updateSocial() {
            const db = getDatabase();
            if (this.social_facebook_link != "") {
                update(ref(db, '/users/travel_agency/' + this.userId), {
                    fb_link: this.social_facebook_link,
                }).then(() => {
                    console.log("Social Media Link Updated ")
                })
            }

            if (this.social_instagram_link != "") {
                update(ref(db, '/users/travel_agency/' + this.userId), {
                    insta_link: this.social_instagram_link,
                }).then(() => {
                    console.log("Social Media Link Updated ")
                })
            }

            if (this.social_twitter_link != "") {
                update(ref(db, '/users/travel_agency/' + this.userId), {
                    twitter_link: this.social_twitter_link,
                }).then(() => {
                    console.log("Social Media Link Updated ")
                })
            }
            //end Update social                  
        },

        //method to submit report to admin
        async submitReport() {
            const db = getDatabase();
            if (this.report_subject == "" || this.report_content == "") {
                return;
            }
            const report = ref(db, '/reports/');
            const reportContent = push(report);
            set(reportContent, {
                subject: this.report_subject,
                username: this.$route.params.id,
                content: this.report_content,
                date_sent: this.date,
                time_sent: this.time,
            });
            alert('Report Submitted');
            this.report_subject = "";
            this.report_content = "";
        },// end report

        //get date,time,yr method
        getDate: function () {
            return new Date().toLocaleDateString();
        },
        getTime: function () {
            return new Date().toLocaleTimeString();
        },
        getCurrentYear: function () {
            return new Date().getFullYear();
        },
        //email verification method
        sendVerification() {
            const auth = getAuth();
            sendEmailVerification(auth.currentUser)
                .then(() => {
                    console.log('verification sent!')
                });
        },

        //method to approve pending request
        approveBooking(id,destination_name, destination_province, scheduled_date,
            transaction_date, boat_name, boat_capacity,
            customer_name, price, payID, activities) {
            const db = getDatabase();
            const bookingRef = ref(db, '/boatbooking/');
            const bookingContent = push(bookingRef);
            set(bookingContent, {
                destination_name: destination_name,
                destination_province: destination_province,
                date_scheduled: scheduled_date,
                date_booked: transaction_date,
                pump_boat_name: boat_name,
                seating_capacity: boat_capacity,
                customer_name: customer_name,
                price: price,
                payID: payID,
                activities: activities,
                ticketStatus: 'Ongoing',
                agency_name: this.$route.params.id,
            });

            //push notifications to the customer
            const notifRef = ref(db, '/notifications/' + customer_name);
            const notifContent = push(notifRef);
            set(notifContent, {
                username: this.$route.params.id,
                messageToTxt: customer_name,
                subjectTxt: 'Your booking has been accepted',
                messageTxt: 'Have a good day',
                date_sent: this.date,
                time_sent: this.time,
            })

            //remove ticekt from pending
            const pendingRef = ref(db, '/Pending/');
            onValue(pendingRef, (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.val().payID == payID) {
                        console.log(childSnapshot.key)
                        remove(ref(db, '/Pending/' + id), {
                        })
                            .then(() => {
                                console.log("pending removed: ");
                            }).catch((error) => {
                                console.log(error);
                            });
                    }
                })
            })

            //removed pump boat from queue
            remove(ref(db, '/queue/' + this.$route.params.id + '/' + boat_name), {
            })
                .then(() => {
                    console.log("removed pump boat from queue: " + boat_name + '\t from:' + this.$route.params.id);
                }).catch((error) => {
                    console.log(error);
                });

            alert('Booking approved!');
        },//end approve method

        //method to update new password
        async savePassword() {
            const auth = getAuth();
            const user = auth.currentUser;
            if (this.input_password == "" || this.new_password == "" || this.input_password == null || this.new_password == null) {
                alert('incorrect password')
                return;
            }
            if (this.input_password != this.new_password) {
                alert('incorrect password')
                return;
            }
            updatePassword(user, this.new_password).then(() => {
                alert('password updated')
            }).catch((error) => {
                console.log(error)
            });
        },

        //to update ticket status to complete
        async completeTicket(id, payID, ticketStatus) {
            const db = getDatabase();
            if (ticketStatus == 'Cancelled') {
                alert('Ticket is cancelled')
                return;
            }
            const bookingRef = ref(db, '/boatbooking/');
            onValue(bookingRef, (snapshot) => {
                let data = snapshot.val();
                Object.keys(data).forEach((key) => {             
                    if (data[key].payID == payID && data[key].ticketStatus == "Ongoing") {
                        console.log('ref =' + id)
                        update(ref(db, '/boatbooking/' + '/'+ key), {
                            ticketStatus: 'Completed',
                        }).then(() => {
                            console.log('Ticket updated')
                        })
                    }
                })
            })
        },
        
        //method for sending message to pump boat operator
        messageBoat(id) {
            //database references
            const db = getDatabase();
            const messageRef = ref(db, '/messages/' + this.$route.params.id + '/' + id);
            const amessageRef = ref(db, '/MessageUsers/' + id);
            const message = push(messageRef);
            //
            set(message, {
                username: this.$route.params.id,
                content: 'Hello, '+ id,
                date_sent: this.date,
                time_sent: this.time,
            });
            const Amessage = push(amessageRef);
            set(Amessage, {
                subject: 'Pending',
                messageToTxt: id,
                messageTxt:'Hello, '+ id,
                username: this.$route.params.id,
                date_sent: this.date,
                time_sent: this.time,
            });
            console.log('convo initiated')
             this.$router.push({ name: 'inbox', params: { id: id } })
        },

        //method for sending message to customer
        messageCustomer(id) {
             //database references
            const db = getDatabase();
            const messageRef = ref(db, '/messages/' + this.$route.params.id + '/' + id);
            const amessageRef = ref(db, '/MessageUsers/' + id);
            const message = push(messageRef);
            //
            set(message, {
                username: this.$route.params.id,
                content: 'Hello, '+ id,
                date_sent: this.date,
                time_sent: this.time,
            });
            const Amessage = push(amessageRef);
            set(Amessage, {
                subject: 'Pending',
                messageToTxt: id,
                messageTxt: 'Hello, '+ id,
                username: this.$route.params.id,
                date_sent: this.date,
                time_sent: this.time,
            });
            
            console.log('convo initiated')
            this.$router.push({ name: 'inbox', params: { id: id } })
        }
    }
}
</script>

<style scoped>
.feather {
    width: 16px;
    height: 16px;
    vertical-align: text-bottom;
}

/*
 * Sidebar
 */

.sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    /* Behind the navbar */
    padding: 0;
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

.sidebar-sticky {
    position: -webkit-sticky;
    position: fixed;
    top: 48px;
    /* Height of navbar */
    height: calc(100vh - 48px);
    padding-top: .5rem;
    overflow-x: hidden;
    overflow-y: auto;
    /* Scrollable contents if viewport is shorter than content. */
}

.nav-item {
    margin-left: 5%;
}

.sidebar .nav-link {
    text-align: left;
    font-weight: 500;
    color: #333;
}

.sidebar .nav-link .feather {
    margin-right: 4px;
    color: #999;
}

.sidebar .nav-link.active {
    color: #007bff;
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.active .feather {
    color: inherit;
}

.sidebar .nav-link:hover {
    background-color: #999;
    color: white;
    border-radius: 30px;
}

.sidebar-heading {
    font-size: .75rem;
    text-transform: uppercase;
}

.mainColumn {
    width: 800px;
    margin-left: 20%;
    margin-top: 7%;
    margin-right: 5%;
    color: black;
    margin-bottom: 5%;
}

.ui-w-80 {
    width: 150px !important;
    height: 150px;
    border-radius: 50%;
    background-color: #999;
}

.btn-default {
    border-color: rgba(24, 28, 33, 0.1);
    background: rgba(0, 0, 0, 0);
    color: #4E5155;
}

label.btn {
    margin-bottom: 0;
}

.btn-outline-primary {
    border-color: #26B4FF;
    background: transparent;
    color: #26B4FF;
}

.btn {
    cursor: pointer;
}

.text-light {
    color: #babbbc !important;
}

.btn-facebook {
    border-color: rgba(0, 0, 0, 0);
    background: #3B5998;
    color: #fff;
}

.btn-instagram {
    border-color: rgba(0, 0, 0, 0);
    background: #000;
    color: #fff;
}

.card {
    background-clip: padding-box;
    box-shadow: 0 1px 4px rgba(24, 28, 33, 0.012);
}

.row-bordered {
    overflow: hidden;
}

.account-settings-fileinput {
    position: absolute;
    visibility: hidden;
    width: 1px;
    height: 1px;
    opacity: 0;
}

.account-settings-links .list-group-item.active {
    font-weight: bold !important;
}

html:not(.dark-style) .account-settings-links .list-group-item.active {
    background: transparent !important;
}

.light-style .account-settings-links .list-group-item {
    padding: 0.85rem 1.5rem;
    border-color: rgba(24, 28, 33, 0.03) !important;
}

.light-style .account-settings-links .list-group-item.active {
    color: #4e5155 !important;
}

.material-style .account-settings-links .list-group-item {
    padding: 0.85rem 1.5rem;
    border-color: rgba(24, 28, 33, 0.03) !important;
}

.material-style .account-settings-links .list-group-item.active {
    color: #4e5155 !important;
}

.dark-style .account-settings-links .list-group-item {
    padding: 0.85rem 1.5rem;
    border-color: rgba(255, 255, 255, 0.03) !important;
}

.dark-style .account-settings-links .list-group-item.active {
    color: #fff !important;
}

.light-style .account-settings-links .list-group-item.active {
    color: #4E5155 !important;
}

.light-style .account-settings-links .list-group-item {
    padding: 0.85rem 1.5rem;
    border-color: rgba(24, 28, 33, 0.03) !important;
}

.form-group {
    text-align: left;
    color: #4E5155;
}

.table {
    width: 1200px;
    font-size: 13px;
}

td:hover {
    cursor: pointer;
}

th {
    width: auto;
}

.table-btn {
    font-size: 11px;
    border-radius: 10px;
    border: #fff;
    color: white;
    background: #333;
}

.table-btn:hover {
    background: #4e5155;
    color: white;
}

.ongoing_status {
    background: rgb(50, 50, 233);
    color: white;
    border: #fff;
    border-radius: 10px;
}

.complete_status {
    background: green;
    color: white;
    border: #fff;
    border-radius: 10px;
}

.cancel_status {
    background: red;
    color: white;
    border: #fff;
    border-radius: 10px;
}
</style>