import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import axios from 'axios';
import '../../App.css';

//create the Student Home Component
class JobList extends Component {
    constructor(props){
        super(props);
        this.state = {
            studentId : "",
            //joblist:this.props.jobs
        }
        // this.handleLogout = this.handleLogout.bind(this);
        // this.changeActivenav = this.changeActivenav.bind(this);
    }
    render(){
        let jobs = null;
        //console.log(this.props.jobs)
        // let joblist = this.state.joblist
        // console.log(joblist)
        // if(joblist.length> 0){
        //     jobs = (
        //         <div>
        //             {joblist.map(job => {
        //                 return(<div>
        //                 <h3>{job.title}</h3>
        //                 <p>{job.location}</p>
        //                 <p>{job.category}</p>
        //                 </div>
        //                 )
        //             })}
        //         </div>
        //     )
        // }
        console.log("hello")
       return(
        {jobs}
       )

}
}

export default JobList;