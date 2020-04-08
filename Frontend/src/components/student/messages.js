import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import axios from 'axios';
import '../../App.css';
import StudentNav from './studentNavbar';
import { Card, CardContent, Button, Dialog, DialogContent, TablePagination, Avatar} from '@material-ui/core/';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import CategoryIcon from '@material-ui/icons/Category';
import emptyPic from '../../images/empty-profile-picture.png';
import {environment} from '../../Utils/constants'


//create the Student Home Component
class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId: 0,
            messagelist: null,
            messageindex: -1,
            convofilter: [],
            namesearch:"",
            locsearch:"",
            appiledJob:[],
            style:[],
            uploadresume:false,
            resume:null,
            currentjobId:0,
            currentcompanyId:0,
            emptyprofilepic:emptyPic,
            rowsPerPage:5,
            page:0,
            messagetext:""
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.showJob = this.showJob.bind(this);
        this.convoFilter = this.convoFilter.bind(this);
        this.applyJob = this.applyJob.bind(this);
        this.uploadResume = this.uploadResume.bind(this);
        this.getResume = this.getResume.bind(this);
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

    getResume = (e) => {
        this.setState({
            resume:e.target.files[0]
        })
    }

    showJob = (e) => {
        this.setState({
            messageindex: e
        })

    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };


    convoFilter = (e) => {
        let convoFilters = this.state.convoFilter
        let jobtypeindex = convoFilters.indexOf(e)
        if (jobtypeindex <= -1) {
            convoFilters.push(e)
            this.setState({
                convoFilter: convoFilters
            })
        } else {
            convoFilters.splice(jobtypeindex, 1)
            this.setState({
                convoFilter: convoFilters
            })
        }
    }

    applyJob = async (jobId,companyId) => {
        let appiledJob = []
        let fdata = new FormData();
        fdata.append('jobId', jobId);
        fdata.append('companyId',companyId)
        fdata.append('studentId', localStorage.getItem('studentId'));
        fdata.append('status',"Pending");
        fdata.append('appliedDate',new Date().toISOString().slice(0,9));
        fdata.append('file', this.state.resume);

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        let data = {
            'jobId':jobId,
            'companyId':companyId,
            'studentId':Number(localStorage.getItem('studentId')),
            'appliedDate': new Date().toISOString().slice(0,10),
            'resume':this.state.resume
        }
        await console.log(fdata)
        const rest = await axios.post(environment.baseUrl+'/student/applyjob' ,fdata,config)
        .then((response) => {
            console.log(response.data)
            appiledJob = this.state.appiledJob
            this.uploadResume(0,0)
            this.setState({
                appliedjob: appiledJob.push(jobId)
            })

        })
    }

    uploadResume = (companyId,jobId) =>
    {
        console.log(companyId)
        console.log(jobId)
        console.log("Resume upload")
        this.setState(currentState =>({
            uploadresume: !currentState.uploadresume,
            currentjobId: jobId,
            currentcompanyId: companyId
        }))
    }

    sendMessage = (receiverId) =>{
            // e.preventDefault();
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
                        // dateTime: currentdate.getDay() + " " + currentdate.getMonth() + " " + currentdate.getDate() + " " + currentdate.getFullYear() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()
                    }]}}
                }
           
            console.log(data)
            axios.post(environment.baseUrl+'/message/sendmessage', data)
                .then(response => {
                    console.log("in frontend after response");
                    console.log(response.data)
                    if (response.data) {
                        this.fetchmessages()
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
        let convofilter = [];
        let namesearch = this.state.namesearch;
        let locsearch = this.state.locsearch;

        if (this.state.messagelist) {
            console.log(this.state.messagelist)
            let messagelist = this.state.messagelist
            convofilter = this.state.convofilter
            if (namesearch.length>0)
            {
                messagelist = messagelist.filter((message) => {
                    return (message.title.indexOf(namesearch) > -1 || message.Company[0].name.indexOf(namesearch) > -1)
                })
            }

            if (locsearch.length>0)
            {
                messagelist = messagelist.filter((message) => {
                    return message.location.indexOf(locsearch) > -1
                })
            }
            if (convofilter.length > 0) {
                messagelist = messagelist.filter((message) => {
                    return convofilter.indexOf(message.category) > -1
                })
            }
            console.log(this.state.studentId)
            if (messagelist.length > 0) {
                conversations = (
                    <div>
                        {messagelist.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((message,index) => {
                            //{joblist.map((job, index) => {
                            var lastmsg = message.messages
                            console.log(lastmsg.length)
                            return (<div >
                                <Link onClick={() => this.showJob(index)} style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
                                    <div class="col-md-2"   ><Avatar src={message.info[0].image?message.info[0].image:this.state.emptyprofilepic} style={{height:'50px', width:'50px',position:'relative',left:'-20px'}} >DP</Avatar></div>
                                    <div class="col-md-8" style={{padding: '0px',marginBottom:'16px'}}>
                                    <p style={{ fontSize: '16px', color: 'rgba(0,0,0,.8)', fontWeight: '400', marginBottom: '0px' }}>{message.info[0].name?message.info[0].name:message.info[0].first_name+" "+message.info[0].last_name}</p>
                                    <p style={{ fontSize: '14px', color: 'rgba(0,0,0,.8)', fontWeight: '400', marginBottom: '0px' }}>{message.info[0].college?message.info[0].college:message.info[0].location}</p>
                                    <p style={{ fontSize: '14px', color: 'rgba(0,0,0,.56)', fontWeight: '400', marginBottom: '0px' }}>{message.messages[(lastmsg.length)-1].message}</p></div>
                                    <div class="col-md-2" style={{padding: '0px', fontSize: '14px', color: 'rgba(0,0,0,.56)'}}>
                                        {message.messages[(lastmsg.length)-1].dateTime.substring(0,6)}
                                    </div>
                                    <hr style = {{width:'200%', position:"relative", left:"-50px"}}></hr>
                                    </Link>
                            </div>
                            )
                        })}
                        <TablePagination
                                rowsPerPageOptions={[1,2,5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={messagelist.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
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
                // const degree = ((convodetailed.info[0].education[0].degree && convodetailed.info[0].education[0].major)?convodetailed.info[0].education[0].degree+","+convodetailed.info[0].education[0].major+" · ":"")
                detailedconvo = (
                    <div>
                        <div style={{height:'45px', textAlign:'center'}}>
                        <h4 style = {{fontFamily : "Arial",fontWeight:"700", fontSize : '18px', margin : '0px'}}>{convodetailed.info[0].name?convodetailed.info[0].name:convodetailed.info[0].first_name+" "+convodetailed.info[0].last_name}</h4>
                        <p style={{ fontSize: '13px', fontWeight: '400', margin : '0px', lineheight : '20px', color : 'rgba(0,0,0,.56)', }}>{convodetailed.info[0].college?(convodetailed.info[0].education[0].degree+","+convodetailed.info[0].education[0].major+" · "+convodetailed.info[0].college):(convodetailed.info[0].email+" · "+convodetailed.info[0].location)}</p>
                        <hr style = {{width:'105%', position:"relative", left:"-16px",marginTop:'12px'}}></hr></div>
                        <div style = {{height : '310px', paddingTop:'10px'}}>
                            {console.log(convodetailed.messages[0].fromId)}
                            {convodetailed.messages.map((data,index) => {
                                if(data.fromId===this.state.studentId){
                                    return(
                                    <div>
                                    <div style={{display:'flex',flexWrap:'row wrap', alignItems:'flex-start',float:'right'}}>
                                        <div style={{backgroundColor:'#e6f0f'}}>{data.message}</div>
                                    </div><br/></div>)
                                }
                                else{
                                    return(
                                    <div style={{display:'flex',flexWrap:'row wrap', alignItems:'flex-end'}}>
                                        <Avatar src={convodetailed.info[0].image} style={{height:'25px',width:'25px'}}></Avatar>
                                        <div>{data.message}</div>
                                    </div>)
                                }
                            })}
                        </div>
                        <hr style = {{width:'105%', position:"relative", left:"-16px",marginTop:'12px'}}></hr>
                        <input onChange = {this.inputChangeHandler} name = "messagetext" value = {this.state.messagetext} style = {{border:'solid .75px', borderColor:'', borderRadius:'2px', width:'90%', marginLeft:'20px'}} height = '50'/>
                        <SendRoundedIcon onClick={()=>this.sendMessage(convodetailed.info[0]._id)} fontSize='large' style={{position:'relative',top:'5px',left:'5px',backgroundColor:'#1569e0',color:'white',borderRadius:'110%'}}></SendRoundedIcon>
                    {/* <div style={{float:"left", position:'relative',left:'10px',top:'-20px'}}><img src={convodetailed.image?convodetailed.image:this.state.emptyprofilepic} height='104px' width='104px' style={{ position:'relative',top:'20px',left:'-30px'}} alt='Profile'/></div>
                     <div><p style={{ fontSize: '24px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.8)' }}>{convodetailed.title}</p>
                        <p style={{ fontSize: '18px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.8)' }}>{convodetailed.Company[0].name}</p>
                        <div class="row">
                                <div class="col-md-3" style={{ padding: "0px" }}>
                                    <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-map-marker" style={{ color: "#1569E0" }}></span> {convodetailed.location}</div>
                                </div> <div class="col-md-3" style={{ padding: "0px" }}>
                                    <div style={{ fontSize: "13px" }}><span style={{ color: "#1569E0" }}><CategoryIcon/></span> {convodetailed.category}</div>
                                </div> <div class="col-md-3" style={{ padding: "0px" }}>
                                    <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-usd" style={{ color: "#1569E0" }}></span> {convodetailed.salary + " per hour"}</div>
                        </div></div>
                        <p style={{ fontSize: '14px', fontWeight: '400', color: 'rgba(0,0,0,.56)' }}>Posted on {convodetailed.posting_date}</p></div>
                        <div style={{ border: 'Solid 1px', borderRadius: '5px', padding: '30px', marginBottom: '24px' }}>
                            <div class = 'col-md-9'> 
                            <p style={{ fontSize: '16px', fontWeight: '500', color: 'rgba(0,0,0,.8)', position:'relative', top:'-12px',left:'-15px'}}>Applications close on {convodetailed.deadline}</p></div>
                            <div class = 'col-md-3'>                            
                            <button class="btn btn-primary" style={{ backgroundColor: '#0d7f02', position:'relative', top:'-18px',border:'0px'}} onClick={()=>this.uploadResume(convodetailed.company_id,convodetailed._id)}>Quick Apply</button></div>
                            <Dialog
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                                open={this.state.uploadresume}>
                                <div>
                                <h2 id="simple-modal-title">Upload Resume</h2>
                                <DialogContent>
                                    <div style={{border:'solid 1px',borderRadius:'5px',height:'50px',width:'97%',padding:'15px 0px 0px 20px',marginBottom:'15px'}}>
                                        <input type="file" name="resume" onChange={this.getResume}/>
                                    </div>
                                    <div className='col-md-8'>
                                    </div>
                                    <div className='col-md-4'>
                                        <button onClick={()=>{this.applyJob(convodetailed._id,convodetailed.company_id)}} class="btn btn-primary" style={{backgroundColor:'#1569E0',borderRadius:'5px'}}>Apply</button>
                                    </div>
                                </DialogContent>                  
                                </div>
                            </Dialog>
                        </div>
                        <div >
                        <h2 style={{ fontSize: '27px', fontWeight: 'bold', textDecoration: 'underline', color: 'rgba(0, 0, 0, 0.8)' }}>{convodetailed.title}</h2>
                        <p style={{ lineHeight: '20px', fontSize: '16px' }}>{convodetailed.job_description}</p>
                        </div> */}
                    </div>
                )}
            }
        }
        return (
            <div>
                <StudentNav comp="Messages" />
                <div style={{ paddingLeft: '5%', paddingRight: '5%', fontFamily: 'Arial' }}>
                {/* <Card>
                    <CardContent>
                        <div style={{paddingBottom:'40px', marginBottom:'13px'}}>
                        <div class="active-pink-4 mb-4" style={{ width: "50%",float:"left"}}>
                            <input class="form-control" type="text"  name="namesearch" id="namesearch" style={{ width: "80%", }} placeholder="Job titles or Employers" aria-label="Job titles or Employers" onChange={this.inputChangeHandler}/>
                        </div>   
                        <div class="active-pink-4 mb-4" style={{ width: "50%",float:"right"}}>
                            <input class="form-control" type="text"  name="locsearch" id="locsearch" style={{ width: "80%", }} placeholder="Location" aria-label="Location" onChange={this.inputChangeHandler}/>
                        </div>
                        </div>
                        <div style={{marginTop:'13px'}}>
                            <Button variant="outlined" color="primary" href="#outlined-buttons" style={{height:"35px",borderRadius: "20px",marginRight:"5px"}} onClick={() => this.convoFilter("Full Time")}>Full-Time Job</Button>
                            <Button variant="outlined" color="primary" href="#outlined-buttons" style={{height:"35px",borderRadius: "20px",marginRight:"5px"}} onClick={() => this.convoFilter("Part Time")}>Part-Time</Button>
                            <Button variant="outlined" color="primary" href="#outlined-buttons" style={{height:"35px",borderRadius: "20px",marginRight:"5px"}} onClick={() => this.convoFilter("Internship")}>Internship</Button>
                            <Button variant="outlined" color="primary" href="#outlined-buttons" style={{height:"35px",borderRadius: "20px",marginRight:"5px"}} onClick={() => this.convoFilter("On Campus")}>On-Campus</Button>
                        </div>
                    </CardContent>
                </Card> */}
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
                        <Card style ={{borderRadius:'0px', height:'450px'}}>
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