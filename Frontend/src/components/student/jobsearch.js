import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import axios from 'axios';
import '../../App.css';
import StudentNav from './studentNavbar';
import { Card, CardContent, Button, Dialog, DialogContent, TablePagination, Avatar} from '@material-ui/core/';
import CategoryIcon from '@material-ui/icons/Category';
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
            emptyprofilepic:emptyPic,
            rowsPerPage:5,
            page:0
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.showJob = this.showJob.bind(this);
        this.jobFliter = this.jobFilter.bind(this);
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
                        {joblist.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((job,index) => {
                            //{joblist.map((job, index) => {
                            return (<div >
                                <Link onClick={() => this.showJob(index)} style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
                                    <div class="col-md-2" style={{marginTop:'10px'}}><Avatar src={job.Company[0].image?job.Company[0].image:this.state.emptyprofilepic} style={{height:'70px', width:'70px',borderRadius:'0px',position:'relative',left:'-20px'}} >DP</Avatar></div>
                                    <div class="col-md-10" style={{marginBottom:'16px'}}>
                                    <p style={{ fontSize: '16px', fontWeight: '700' }}>{job.title}</p>
                                    <p style={{ fontSize: '16px', fontWeight: '400' }}>{job.Company[0].name}-{job.location}</p>
                                    <p style={{ fontSize: '14px', fontWeight: '400' }}>{job.category}</p></div>
                                    <hr style = {{width:'200%', position:"relative", left:"-50px"}}></hr>
                                    {/* <svg>
                                        <line x1="0" y1="0" x2="300" y2="0" style={{stroke:'rgb(255,0,0)',strokeWidth:'3'}} />
                                    </svg> */}
                                    </Link>
                            </div>
                            )
                        })}
                        <TablePagination
                                rowsPerPageOptions={[1,2,5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={joblist.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                // SelectProps={{
                                //     inputProps: { 'aria-label': 'rows per page' },
                                //     native: true,
                                // }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                // style={{fontSize:'2px'}}
                                />
                    </div>
                )
                jobdetailed = joblist[this.state.jobindex]
                detailedjob = (
                    <div>
                    <div style={{float:"left", position:'relative',left:'10px',top:'-20px'}}><img src={jobdetailed.image?jobdetailed.image:this.state.emptyprofilepic} height='104px' width='104px' style={{ position:'relative',top:'20px',left:'-30px'}} alt='Profile'/></div>
                     <div><p style={{ fontSize: '24px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.8)' }}>{jobdetailed.title}</p>
                        <p style={{ fontSize: '18px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.8)' }}>{jobdetailed.Company[0].name}</p>
                        <div class="row">
                                <div class="col-md-3" style={{ padding: "0px" }}>
                                    <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-map-marker" style={{ color: "#1569E0" }}></span> {jobdetailed.location}</div>
                                </div> <div class="col-md-3" style={{ padding: "0px" }}>
                                    <div style={{ fontSize: "13px" }}><span style={{ color: "#1569E0" }}><CategoryIcon/></span> {jobdetailed.category}</div>
                                </div> <div class="col-md-3" style={{ padding: "0px" }}>
                                    <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-usd" style={{ color: "#1569E0" }}></span> {jobdetailed.salary + " per hour"}</div>
                        </div></div>
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
                        <Card style ={{width:'101%'}}><CardContent>{jobs}</CardContent></Card>

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