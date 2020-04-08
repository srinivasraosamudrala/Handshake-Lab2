import React,{ Component } from 'react';
import {Route} from 'react-router-dom';
import Navbar from './LandingPage/Navbar';
import studentLogin from './student/login';
import studentSignup from './student/signup';
import studentProfile from './student/profile';
import companyLogin from './company/login';
import companySignup from './company/signup';
import companyHome from './company/home';
import companyEvents from './company/events';
import companyStudents from './company/studentsearch';
import companyProfile from './company/profile';
import companypostJob from './company/postJob';
import companypostEvent from './company/postevent';
import companyEventDetails from './company/events/registrations';
import studentJobApplications from './student/jobapplications';
import studentJobSearch from './student/jobsearch';
import studentSearch from './student/studentsearch';
import studentEvents from './student/events'
import studentEventRegistrations from './student/registrations'
import companyApplicants from './company/applicants'
import viewStudents from './student/viewstudent'
import studentConversations from './student/messages'
import companyConversations from './company/messages'



class Main extends Component{
    render(){
        return(
            <div>
                    <Route path = "/" component = {Navbar} />
                    <Route path="/student/login"  component={studentLogin}/>
                    <Route path="/student/signup" component={studentSignup}/>
                    <Route path="/student/profile" component={studentProfile}/>
                    <Route path="/company/login"  component={companyLogin}/>
                    <Route path="/company/signup" component={companySignup}/>
                    <Route path="/company/home"   component={companyHome}/>
                    <Route path="/company/postjob" component={companypostJob}/>
                    {/* <Route path="/company/job/details" component={companyJobDetails}/> */}
                    <Route path="/company/events" exact component={companyEvents}/>
                    <Route path="/company/postevent" component={companypostEvent}/>
                    <Route path="/company/events/registrations/:eventId" exact component={companyEventDetails}/>
                    <Route path="/company/studentsearch" component={companyStudents}/>
                    <Route path="/company/profile" component={companyProfile}/>
                    <Route path="/company/applicants/:jobId" component={companyApplicants}/>
                    <Route path="/company/conversations" component = {companyConversations}/> 
                    {/* <Route path="/student/" component={studentNav}/> */}
                    <Route path="/student/jobs/search" component={studentJobSearch}/>
                    <Route path="/student/jobs/applications" component = {studentJobApplications}/>
                    <Route path="/student/studentsearch" component={studentSearch}/>
                    <Route path="/student/events" component = {studentEvents}/>
                    <Route path="/student/event/registrations" component = {studentEventRegistrations}/>
                    <Route path="/student/viewStudent" component = {viewStudents}/>
                    <Route path="/student/conversations" component = {studentConversations}/> 
            </div>
        )
    }
}

export default Main;