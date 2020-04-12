import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';
import StudentNav from './studentNavbar';
import { Card, CardContent, Button, Dialog, DialogContent, TablePagination, Avatar} from '@material-ui/core/';
// import SendRoundedIcon from '@material-ui/icons/SendRounded';
import emptyPic from '../../images/empty-profile-picture.png';
import {environment} from '../../Utils/constants'


//create the Student Home Component
class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId: 0,
            messagelist: null,
            messageindex: 0,
            style:[],
            emptyprofilepic:emptyPic,
            rowsPerPage:5,
            page:0,
            messagetext:""
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.showConversation = this.showConversation.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    handleChangePage = (event, newPage) => {
        this.setState({
            page:newPage
        })
      };
    
    handleChangeRowsPerPage = (event) => {
        let rowsPerPage = parseInt(event.target.value, 10)
        this.setState({
            page:0,
            rowsPerPage:rowsPerPage
        })
      };

    inputChangeHandler = (e) => {
        const value = e.target.value
        this.setState({
            [e.target.name]: value
        })
    }

    showConversation = (e) => {
        this.setState({
            messageindex: e
        })

    }

    sendMessage = (receiverId) =>{
            let currentdate = new Date()

            const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' }) 
            const [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(currentdate) 

            let datestr  = mo+" "+da+" "+ye+" "+currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()
            
            let data = null
                data={
                    id1 : this.state.studentId,
                    id2 : receiverId,
                    update :  { $push:{messages:[{
                        fromId: this.state.studentId,
                        message: this.state.messagetext,
                        dateTime: datestr
                    }]}}
                }
           
            console.log(data)
            axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
            axios.post(environment.baseUrl+'/message/sendmessage', data)
                .then(response => {
                    console.log(response.data)
                    if (response.data) {
                        this.setState({
                            messageindex:0
                        })
                        this.fetchmessages()
                        console.log(this.state.messageindex)
                    } else if (response.data.error) {
                        console.log("response" + response.data.error)
                    }
                }
                )
    }


    componentDidMount() {
        this.setState({ studentId: localStorage.getItem('studentId') })
        this.fetchmessages()
    }

    fetchmessages = () =>{
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get(environment.baseUrl+'/message/fetchmessages/' + localStorage.getItem('studentId'))
            .then((response) => {
                console.log(response.data)
                if (response.data.length>0) {
                    this.setState({
                        messagelist: response.data,
                        messagetext:""
                    })
            }
        })
        console.log(this.state.messagelist)
    }

    render() {
        let conversations = null;
        let detailedconvo = null;
        let convodetailed = null;

        if (this.state.messagelist) {
            console.log(this.state.messagelist)
            let messagelist = this.state.messagelist

            let compare = (a,b) =>{
                let comparison = 0
                var alastmsg = a.messages
                var blastmsg = b.messages
                if (a.messages[(alastmsg.length)-1].dateTime < b.messages[(blastmsg.length)-1].dateTime) {
                    comparison = 1;
                  } else if (a.messages[(alastmsg.length)-1].dateTime > b.messages[(blastmsg.length)-1].dateTime) {
                    comparison = -1;
                  }
                  return comparison;
            }
            if (messagelist.length)
                messagelist.sort(compare);

            console.log(this.state.studentId)
            if (messagelist.length > 0) {
                conversations = (
                    <div>
                    <div style={{height:'296px', overflow:'auto',paddingLeft:'10px'}}>
                        {messagelist.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((message,index) => {
                            var lastmsg = message.messages
                            return (<div>
                                <Link onClick={() => this.showConversation(index)} style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
                                    <div class="col-md-2"   ><Avatar src={message.info[0].image?message.info[0].image:this.state.emptyprofilepic} style={{height:'50px', width:'50px',position:'relative',left:'-20px'}} >DP</Avatar></div>
                                    <div class="col-md-8" style={{padding: '0px',marginBottom:'16px'}}>
                                    <p style={{ fontSize: '16px', color: 'rgba(0,0,0,.8)', fontWeight: '400', marginBottom: '0px' }}>{message.info[0].name?message.info[0].name:message.info[0].first_name+" "+message.info[0].last_name}</p>
                                    <p style={{ fontSize: '14px', color: 'rgba(0,0,0,.8)', fontWeight: '400', marginBottom: '0px' }}>{message.info[0].college?message.info[0].college:message.info[0].location}</p>
                                    <p style={{ fontSize: '14px', color: 'rgba(0,0,0,.56)', fontWeight: '400', marginBottom: '0px' }}>{message.messages[(lastmsg.length)-1].message}</p></div>
                                    <div class="col-md-2" style={{padding: '0px', fontSize: '14px', color: 'rgba(0,0,0,.56)'}}>
                                        {message.messages[(lastmsg.length)-1].dateTime.substring(0,6)}
                                    </div>
                                    <hr style = {{width:'130%', position:"relative", left:"-100px"}}></hr>
                                    </Link>
                            </div>
                            )
                        })}
                        </div>
                        <TablePagination
                                rowsPerPageOptions={[1,2,5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={messagelist.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={()=>this.handleChangeRowsPerPage}
                                />
                    </div>
                )
                convodetailed = messagelist[this.state.messageindex]
                console.log(this.state.messageindex)
                if (this.state.messageindex === -1){
                    detailedconvo = (
                        <div style={{height:'200px', textAlign:'center'}}>
                            <p style={{ fontSize: '13px', fontWeight: '500', margin : '0px', lineheight : '20px', color : 'rgba(0,0,0,.60)' }}>No conversation selected.</p>
                        </div>
                    )
                }else{
                detailedconvo = (
                    <div>
                        <div style={{height:'45px', textAlign:'center'}}>
                        <h4 style = {{fontFamily : "Arial",fontWeight:"700", fontSize : '18px', margin : '0px'}}>{convodetailed.info[0].name?convodetailed.info[0].name:convodetailed.info[0].first_name+" "+convodetailed.info[0].last_name}</h4>
                        <p style={{ fontSize: '13px', fontWeight: '400', margin : '0px', lineheight : '20px', color : 'rgba(0,0,0,.56)', }}>{convodetailed.info[0].college?(convodetailed.info[0].education[0].degree+","+convodetailed.info[0].education[0].major+" · "+convodetailed.info[0].college):(convodetailed.info[0].email+" · "+convodetailed.info[0].location)}</p>
                        <hr style = {{width:'105%', position:"relative", left:"-16px",marginTop:'12px'}}></hr></div>
                        <div style = {{height : '310px', paddingTop:'10px', overflow:'auto',position:'relative',top:'10px'}}>
                            {console.log(convodetailed.messages[0].fromId)}
                            {convodetailed.messages.map((data,index) => {
                                if(data.fromId===this.state.studentId){
                                    return(
                                    <div>
                                    <div style={{float:'right',paddingRight:'13px',backgroundColor:'#e6f0ff',height:'30px',padding:'5px 15px',borderRadius:'15px 15px 0px 15px'}}>
                                        <div style={{backgroundColor:'#e6f0f'}}>{data.message}</div>
                                    </div><br/></div>)
                                }
                                else{
                                    return(
                                    <div style={{backgroundColor:'#f0f0f0',height:'30px',padding:'5px 15px',borderRadius:'0px 15px 15px 15px'}}>
                                        <Avatar src={convodetailed.info[0].image} style={{height:'25px',width:'25px'}}></Avatar>
                                        <div>{data.message}</div>
                                    </div>)
                                }
                            })}
                        </div>
                        <hr style = {{width:'105%', position:"relative", left:"-16px",marginTop:'12px'}}></hr>
                        <textarea onChange = {this.inputChangeHandler} name = "messagetext" value = {this.state.messagetext} style = {{border:'solid .75px', borderColor:'', borderRadius:'2px', width:'80%', marginLeft:'20px',resize:'none'}} rows='2'></textarea>
                        <button onClick={()=>this.sendMessage(convodetailed.info[0]._id)} class="btn btn-primary" style={{backgroundColor:'#1569E0',borderRadius:'5px', position:'relative',top:'-20px',left:'10px'}}>Send</button>
                    </div>
                )}
            }
        }
        return (
            <div>
                <StudentNav comp="Messages" />
                <div style={{ paddingLeft: '5%', paddingRight: '5%', fontFamily: 'Arial' }}>
                <div style={{ padding: '0px 0px 16px' }}>
                    <div class="col-md-4" style={{ paddingRight: '5px' }}>
                        <Card style ={{width:'101%', borderRadius:'0px'}}>
                            <CardContent>
                                <h4 style = {{fontFamily : "Arial",fontWeight:"700", fontSize : '18px', textAlign:'center'}}>Messages</h4>
                                <hr style = {{width:'200%', position:"relative", left:"-50px"}}></hr>
                                {conversations}
                            </CardContent>
                        </Card>
                    </div>
                    <div class="col-md-8" style={{ padding: '0px', marginBottom:'30px'}}>
                        <Card style ={{borderRadius:'0px', height:'460px'}}>
                            <CardContent>
                                {detailedconvo}
                            </CardContent>
                        </Card>
                    </div>
                </div>
                </div>
            </div>
        )
    }


}

export default Messages;