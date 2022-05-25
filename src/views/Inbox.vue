<template>
<div class="container">
    <h3 class=" text-center">{{$route.params.id}} Inbox</h3>
    <div class="messaging">
      <div class="inbox_msg">
        <div class="inbox_people">
          <div class="headind_srch">
            <div class="recent_heading">
              <h4>Direct Message</h4>
            </div>  
            <div class="edit_heading">
               <input type="checkbox" id="checkbox" v-model="isEdit" @click="openEdit" class="edit-icon"/>
               <h6>Edit</h6>    
            </div>         
          </div>
          <div class="inbox_chat">
            <div class="chat_list active_chat" v-for="inbox in inboxes" :key="inbox.key" > 
              <div class="chat_people">
                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                <div class="chat_ib">
                  <h5>{{inbox.id}}
                    <span class="chat_date">
                      <button class="btn" v-show="!isEdit"  @click="openConvo(inbox.id)">View</button>      
                      <img src="https://firebasestorage.googleapis.com/v0/b/fantasea-4140a.appspot.com/o/app_media%2Fgarbage2.png?alt=media&token=83b0d802-f360-414c-a8b4-dfc2af72df34" alt="delete" class="remove-message-icon" v-show="isEdit" @click.prevent="deleteThis(inbox.id)">                                        
                    </span>
                    </h5>
                </div>
              </div>
            </div>              
          </div>
        </div>
           <div class="mesgs" v-show="isOpenConvo"> 
          <div class="msg_history">   
            <div v-for="message in messages" :key="message.key" :class="(message.username == username ? 'outgoing_msg' : 'incoming_msg') ">
              <div :class="(message.username == username ? 'sent_msg' : 'received_withd_msg') ">
                <h6 >{{message.username}} </h6>
                <p v-if="message.content !=null ">{{message.content}}</p>
                <p v-else>{{message.messageTxt}}</p>
                <span class="time_date"> {{message.time_sent}}   |  {{ message.date_sent}}</span> </div>
            </div>                
          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <input type="text" class="form-control" placeholder="Type a message" v-model="inputMessage"/>
              <button class="msg_send_btn" type="button"  @click.prevent="sendMessage"><i class="fa fa-paper-plane-o" aria-hidden="true"></i>Send</button>
            </div>
          </div>
        </div>    
      </div>
    </div>
</div>
</template>

<script>
/* eslint-disable */ 
import { getDatabase, ref, get,onValue, child,push,set} from "firebase/database";
import {getAuth, onAuthStateChanged} from 'firebase/auth'

export default {
    name: 'inbox-admin',
    data(){
        return{
            inboxes :[],
            username: '',
            isEdit: false,
            isOpenConvo: false,
            messages: [],
            userKey: '',
            date: '',
            time: '',
            currentYear: '',
        }
    },
    mounted(){
        this.date = this.getDate();
        this.time = this.getTime();
        this.currentYear = this.getCurrentYear();
        const db = getDatabase();
        const dbRef = ref(db);
        onAuthStateChanged(getAuth(), (user) => {
            if (user){ 

                    this.userId = user.uid;
                      get(child(dbRef, '/users/travel_agency/' + this.userId )).then ((snapshot)=>{
                        if(snapshot.exists()){
                            this.username = snapshot.val().name;   
                            let viewInbox = this;
                            const inboxRef = ref(db, '/messages/' +  this.username);
                            onValue(inboxRef, (snapshot) => { 
                                    let data = snapshot.val();
                                    let inboxes  = [];
                                    Object.keys(data).forEach((key) => {                                             
                                    inboxes.push({
                                        id : key,
                                });                                                           
                            });  
                            viewInbox.inboxes = inboxes;          
                        });                                                                                         
                    }                 
                }); //end getChild

                this.openConvo()
            }
        })
       
    },
    methods: {
        openEdit(){
            this.isEdit = true;
        },
        openConvo(id){
            const db = getDatabase();
            this.userKey = id;
            this.isOpenConvo = true;
              let viewMessage = this;
                const messageRef = ref(db, '/messages/' +this.username + '/' + id);
                    onValue(messageRef, (snapshot) => {
                    let data = snapshot.val();
                    let messages  = [];  
                    Object.keys(data).forEach((key) => {              
                    messages.push({
                        id : key,
                        username : data[key].username,
                        messageTxt: data[key].messageTxt,
                        content:   data[key].content,
                        date_sent:   data[key].date_sent,
                        time_sent:  data[key].time_sent,
                    });           
                });  
                viewMessage.messages = messages;
            });
        },
        sendMessage(){
            const db = getDatabase();
            const dbRef = ref(db);       
            const AppmessageRef = ref(db, '/MessageUsers/' + this.userKey);
            const messageRef = ref(db, '/messages/' + this.username + '/' + this.userKey);
            const AmessageRef = ref(db, '/messages/' + this.userKey + '/' + this.username);
            if(this.inputMessage === "" || this.inputMessage === null){
                return;
            }    
            const message = push(messageRef);
            set(message, {
                username: this.username,
                content: this.inputMessage,
                date_sent: this.date,
                time_sent: this.time,
            });
            const Amessage = push(AmessageRef);
            set(Amessage, {
                username: this.username,
                content: this.inputMessage,
                date_sent: this.date,
                time_sent: this.time,

            });
            const Appmessage = push(AppmessageRef);
            set(Appmessage, {
                subject: 'Message',
                messageToTxt: this.userKey,
                messageTxt: this.inputMessage,
                username: this.username,
                date_sent: this.date,
                time_sent: this.time,
            });

            this.inputMessage = "";
            console.log("message sent")
            
        },
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
    }
}
</script>

<style scoped>
.container{
   max-width:1170px;
    margin-top:7.5%;
    margin-left: 10%;
    margin-bottom: 5%;
 }
img{ max-width:100%;}
.inbox_people {
  background: #f8f8f8 none repeat scroll 0 0;
  float: left;
  overflow: hidden;
  width: 40%; border-right:1px solid #c4c4c4;
}
.inbox_msg {
  border: 1px solid #c4c4c4;
  clear: both;
  overflow: hidden;
}
.top_spac{ margin: 20px 0 0;}


.recent_heading {float: left; width:40%;}
.srch_bar {
  display: inline-block;
  text-align: right;
  width: 60%;
}
.headind_srch{ padding:10px 29px 10px 20px; overflow:hidden; border-bottom:1px solid #c4c4c4;}

.recent_heading h4 {
  color: #05728f;
  font-size: 21px;
  margin: auto;
}
.srch_bar input{ border:1px solid #cdcdcd; border-width:0 0 1px 0; width:80%; padding:2px 0 4px 6px; background:none;}
.srch_bar .input-group-addon button {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  padding: 0;
  color: #707070;
  font-size: 18px;
}
.srch_bar .input-group-addon { margin: 0 0 0 -27px;}

.chat_ib h5{ font-size:15px; color:#464646; margin:0 0 8px 0; text-align: left;}
.chat_ib h5 span{ font-size:13px; float:right;}
.chat_ib p{ font-size:14px; color:#989898; margin:auto}
.chat_img {
  float: left;
  width: 11%;
}
.chat_ib {
  float: left;
  padding: 0 0 0 15px;
  width: 88%;
}

.chat_people{ overflow:hidden; clear:both;}
.chat_list {
  border-bottom: 1px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 10px;
}
.chat_list:hover{
   background-color:#ffffff;
   cursor: pointer;
}

.inbox_chat { height: 550px; overflow-y: scroll;}

.active_chat{ background:#ebebeb;}

.incoming_msg_img {
  display: inline-block;
  width: 6%;
}
.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
 }
 .received_withd_msg p {
  background: #ebebeb none repeat scroll 0 0;
  border-radius: 3px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 100%;
  text-align: left;
}
.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}
.received_withd_msg { width: 57%;}
.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 60%;
}

 .sent_msg p {
  background: #05728f none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0; color:#fff;
  padding: 5px 10px 5px 12px;
  width:100%;
  text-align: left;
}
.outgoing_msg{ overflow:hidden; margin:26px 0 26px;}
.sent_msg {
  float: right;
  width: 46%;
}
.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg {border-top: 1px solid #c4c4c4;position: relative;}
.msg_send_btn {
  background: #05728f none repeat scroll 0 0;
  border: medium none;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 11px;
  width: auto;
  margin-right: 2%;
}
.messaging { padding: 0 0 50px 0;}
.msg_history {
  height: 516px;
  overflow-y: auto;
}
.remove-message-icon{
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #bebebe;
  box-shadow: 0 0 0 1px black;
}
.remove-message-icon:hover .icon-def{
  display:block;
  position: inherit;
  
}
.icon-def{
  display: none;
}
.edit-icon{
  width: 30px;
  height: 30px;  
  float: right;
  cursor: pointer;
  background-image: url("https://firebasestorage.googleapis.com/v0/b/fantasea-4140a.appspot.com/o/app_media%2Fedit.png?alt=media&token=00fe41c3-92f9-4fc0-ade7-675bc7ecb2d7");
  background-position: center;
  background-size: cover;
}
.edit_heading h6{
  text-align: center;
  float: right;
  margin-right: 2%;
  margin-top: 1%;
}

</style>