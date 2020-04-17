import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import '../../App.css'
import Handshake_Logo from '../../images/Handshake_Logo.png'
import { connect } from "react-redux";
import { handleLogout } from "../../redux/actions/index";

//create the Navbar Component
class Navbar extends Component {
    constructor(props){
        super(props);
        this.state = {
            activenav : "student"
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.changeActivenav = this.changeActivenav.bind(this);
    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        localStorage.clear();
        this.props.handleLogout();
    }
    changeActivenav = (e) => {
        this.setState({
            activenav : e.target.value
        })
        console.log(this.state)
    }
    render(){
        //if Cookie is set render Logout Button
        let navHeader = null;
        let navUpdate = null;
        let redirectVar = null;
        // if(cookie.load('companycookie')){
        if(localStorage.getItem('companyId')){
            console.log("Able to read company cookie");
            navHeader = (
                <div class="navbar-header">
                    <div style = {{paddingLeft:'15px'}}>
                    <a class="navbar-brand" href = "/company/home"><img class="image" alt="Handshake" src={Handshake_Logo} width="30" height="30" /></a>
                    </div>
                </div>)
            navUpdate = (
                <div>
                    <ul class="nav navbar-nav navbar-right">
                        <li class = 'active'><Link to="/company/home">Jobs</Link></li>
                        <li class='navli'><Link to="/company/events">Events</Link></li>
                        <li class='navli'><Link to="/company/studentsearch">Students</Link></li>
                        <li class='navli'><Link to="/company/conversations">Messages</Link></li>
                        <li class='navli'><Link to="/company/profile">Profile</Link></li>
                        <li class='navli'><Link to="/" onClick = {this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li> 
                    </ul>
                </div>
            );
        // }else if (cookie.load('studentcookie')){
        }else if(localStorage.getItem('studentId')){
            console.log("student cookie");
            navHeader = (
                <div class="navbar-header">
                    <a class="navbar-brand" href = "/student/jobs/search"><img class="image" alt="Handshake" src={Handshake_Logo} width="30" height="30" /></a>
                </div>)
            navUpdate = (
                <navitem>
                    <li><Link to="/student/jobs">Jobs</Link></li>
                </navitem>,
                <navitem class="nav navbar-nav navbar-right">
                        <li class='navli'><Link to="/student/jobs/search">Jobs</Link></li>
                        <li class='navli'><Link to="/student/events">Events</Link></li>
                        <li class='navli'><Link to="/student/studentsearch">Students</Link></li>
                        <li class='navli'><Link to="/student/conversations">Messages</Link></li>
                        <li class='navli'><Link to="/student/profile">Profile</Link></li>
                        <li class='navli'><Link to="/" onClick = {this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li>
                </navitem>
            )
        }
        else{
            navHeader = (
                <div class="navbar-header">
                    <a class="navbar-brand" href = "/student"><img class="image" alt="Handshake" src={Handshake_Logo} width="30" height="30" /> </a>
                </div>)
            navUpdate = (
                    <div>
                    <ul class="nav navbar-nav">
                        <li class='navli'><Link to="/student/login">Students</Link></li>
                        <li class='navli'><Link to="/company/login">Empolyers</Link></li>

                    </ul>
                    {/* <ul class="nav navbar-nav navbar-right">
                        <li class='navli'><Link to="/student/login"><span class="glyphicon glyphicon-log-in"></span> Login</Link></li>
                        <li class='navli'><Link to="/student/signup">Signup</Link></li>
                    </ul> */}
                    </div>
            )
            redirectVar = <Redirect to="/"/>
        }
          
        
        return(
            <div>
            {redirectVar}
            <nav class="navbar navbar-inverse" style={{borderRadius:'0px',backgroundColor:'#0F1035',height:'60px',color:'black',borderColor:'#0F1035'}}>
                <div class="container-fluid" style={{position:'relative',padding:'4px'}}>
                    {navHeader}
                    {navUpdate}
                </div>
            </nav>
            </div>
        )
    }
}

// export default Navbar;
const mapStateToProps = state => {
    console.log(state)
    return {
        studentsList: state.studentlist
    };
};

function mapDispatchToProps(dispatch) {
    return {
        handleLogout: payload => dispatch(handleLogout(payload)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);