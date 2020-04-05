import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import '../../App.css';
import StudentNav from './studentNavbar';
import { Card, CardContent, Button, IconButton, InputBase, TextField, Dialog, DialogContent} from '@material-ui/core/';
import Icon from '@material-ui/core/Icon';
import SearchIcon from '@material-ui/icons/Search';
import JobList from './joblist';
import emptyPic from '../../images/empty-profile-picture.png';
import {environment} from '../../Utils/constants'


//create the Student Home Component
class JobSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId: 0,
            joblist: null,
            jobindex: 0,
            jobfilter: [],
            namesearch:"",
            locsearch:"",
            appiledJob:[],
            style:[],
            uploadresume:false,
            resume:null,
            currentjobId:0,
            currentcompanyId:0,
            emptyprofilepic:emptyPic
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.showJob = this.showJob.bind(this);
        this.jobFliter = this.jobFilter.bind(this);
        this.applyJob = this.applyJob.bind(this);
        this.uploadResume = this.uploadResume.bind(this);
        this.getResume = this.getResume.bind(this);
    }

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
            jobindex: e
        })

    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };


    jobFilter = (e) => {
        let jobfilters = this.state.jobfilter
        let jobtypeindex = jobfilters.indexOf(e)
        if (jobtypeindex <= -1) {
            jobfilters.push(e)
            this.setState({
                jobfilter: jobfilters
            })
        } else {
            jobfilters.splice(jobtypeindex, 1)
            this.setState({
                jobfilter: jobfilters
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


    componentDidMount() {
        this.setState({ studentId: localStorage.getItem('studentId') })
        axios.get(environment.baseUrl+'/student/jobsearch/' + localStorage.getItem('studentId'))
            .then((response) => {
                if (response.data.length>0) {
                    // console.log(response.data[1].Company[0].name)
                    // var base64Flag = 'data:image/jpeg;base64,';
                    // response.data.map((job,index) => {
                    //     console.log("profile")
                    //     // if (job.Company[0].image!== null) {
                    //     //     var imgstring = this.arrayBufferToBase64(job.Company[0].image);
                    //     //     job.Company[0].image = base64Flag + imgstring
                    //     // }
                    // } )
                    this.setState({
                        joblist: response.data
                    })
            }
                

            })
    }

    render() {
        let jobs = null;
        let detailedjob = null;
        let jobdetailed = null;
        let resumeModal = null;
        let jobfilter = [];
        let namesearch = this.state.namesearch;
        let locsearch = this.state.locsearch;

        if (this.state.joblist) {
            // joblist = (<JobList studentId={this.state.studentId} jobs={this.state.joblist} />)
            console.log(this.state.joblist)
            let joblist = this.state.joblist
            jobfilter = this.state.jobfilter
            // console.log(jobfilter)
            // console.log(joblist)
            if (namesearch.length>0)
            {
                joblist = joblist.filter((job) => {
                    return (job.title.indexOf(namesearch) > -1 || job.Company[0].name.indexOf(namesearch) > -1)
                })
            }

            if (locsearch.length>0)
            {
                joblist = joblist.filter((job) => {
                    return job.location.indexOf(locsearch) > -1
                })
            }
            if (jobfilter.length > 0) {
                joblist = joblist.filter((job) => {
                    return jobfilter.indexOf(job.category) > -1
                })
            }
            if (joblist.length > 0) {
                jobs = (
                    <div>
                        {joblist.map((job, index) => {
                            return (<div >
                                <Link onClick={() => this.showJob(index)} style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
                                    <p style={{ fontSize: '16px', fontWeight: '700' }}>{job.title}</p>
                                    <p style={{ fontSize: '16px', fontWeight: '400' }}>{job.Company[0].name}-{job.location}</p>
                                    <p style={{ fontSize: '14px', fontWeight: '400' }}>{job.category}</p>
                                    <hr style = {{width:'200%', position:"relative", left:"-50px"}}></hr>
                                    {/* <svg>
                                        <line x1="0" y1="0" x2="300" y2="0" style={{stroke:'rgb(255,0,0)',strokeWidth:'3'}} />
                                    </svg> */}
                                    </Link>
                            </div>
                            )
                        })}
                    </div>
                )
                jobdetailed = joblist[this.state.jobindex]
                detailedjob = (
                    <div>
                    <div style={{float:"left", position:'relative',left:'10px',top:'-20px'}}><img src={jobdetailed.profilepic?jobdetailed.profilepic:this.state.emptyprofilepic} height='70' width='70' style={{ position:'relative',top:'20px',left:'-30px'}} alt='Profile'/></div>
                     <div><p style={{ fontSize: '24px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.8)' }}>{jobdetailed.title}</p>
                        <p style={{ fontSize: '18px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.8)' }}>{jobdetailed.Company[0].name}</p>
                        <p style={{ fontSize: '14px', fontWeight: '400', color: 'rgba(0,0,0,.56)' }}>{jobdetailed.category}</p>
                        <p style={{ fontSize: '14px', fontWeight: '400', color: 'rgba(0,0,0,.56)' }}>{jobdetailed.location}</p>
                        <p style={{ fontSize: '14px', fontWeight: '400', color: 'rgba(0,0,0,.56)' }}>Posted on {jobdetailed.posting_date}</p></div>
                        <div style={{ border: 'Solid 1px', borderRadius: '5px', padding: '30px', marginBottom: '24px' }}>
                            <div class = 'col-md-9'> 
                            <p style={{ fontSize: '16px', fontWeight: '500', color: 'rgba(0,0,0,.8)', position:'relative', top:'-12px',left:'-15px'}}>Applications close on {jobdetailed.deadline}</p></div>
                            <div class = 'col-md-3'>                            
                            <button class="btn btn-primary" style={{ backgroundColor: '#0d7f02', position:'relative', top:'-18px',border:'0px'}} onClick={()=>this.uploadResume(jobdetailed.company_id,jobdetailed._id)}>Quick Apply</button></div>
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
                                        <button onClick={()=>{this.applyJob(jobdetailed._id,jobdetailed.company_id)}} class="btn btn-primary" style={{backgroundColor:'#1569E0',borderRadius:'5px'}}>Apply</button>
                                    </div>
                                </DialogContent>                  
                                </div>
                            </Dialog>
                        </div>
                        <div >
                        <h2 style={{ fontSize: '27px', fontWeight: 'bold', textDecoration: 'underline', color: 'rgba(0, 0, 0, 0.8)' }}>{jobdetailed.title}</h2>
                        <p style={{ lineHeight: '20px', fontSize: '16px' }}>{jobdetailed.job_description}</p>
                        </div>
                    </div>
                )
            }
        }
        return (
            <div>
                <StudentNav comp="jobsearch" />
                <div style={{ paddingLeft: '5%', paddingRight: '5%', fontFamily: 'Arial' }}>
                <Card>
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
                            <Button variant="outlined" color="primary" href="#outlined-buttons" style={{height:"35px",borderRadius: "20px",marginRight:"5px"}} onClick={() => this.jobFliter("Full Time")}>Full-Time Job</Button>
                            <Button variant="outlined" color="primary" href="#outlined-buttons" style={{height:"35px",borderRadius: "20px",marginRight:"5px"}} onClick={() => this.jobFliter("Part Time")}>Part-Time</Button>
                            <Button variant="outlined" color="primary" href="#outlined-buttons" style={{height:"35px",borderRadius: "20px",marginRight:"5px"}} onClick={() => this.jobFliter("Internship")}>Internship</Button>
                            <Button variant="outlined" color="primary" href="#outlined-buttons" style={{height:"35px",borderRadius: "20px",marginRight:"5px"}} onClick={() => this.jobFliter("On Campus")}>On-Campus</Button>
                        </div>
                    </CardContent>
                </Card>
                <div style={{ padding: '24px 0px 16px' }}>
                    <div class="col-md-4" style={{ paddingRight: '16px' }}>
                        <Card><CardContent>{jobs}</CardContent></Card>

                    </div>
                    <div class="col-md-8" style={{ padding: '0px' }}>
                        <Card style={{ padding: '40px 40px' }}><CardContent>{detailedjob}</CardContent></Card>
                    </div>
                </div>
                </div>
            </div>
        )
    }


}

export default JobSearch;