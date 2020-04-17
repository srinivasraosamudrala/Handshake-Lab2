import React,{Component} from 'react';
import StudentNav from './studentNavbar';
import { Card, CardContent, TablePagination } from '@material-ui/core/';
import emptyPic from '../../images/empty-profile-picture.png';
import { connect } from "react-redux";
import { getStudentRegistrations } from "../../redux/actions/index";


//create the Student Home Component
class Registrations extends Component {
    constructor(props){
        super(props);
        this.state = {
            studentId: "",
            registrations: null,
            jobindex: 0,
            jobfilter: [],
            status:"",
            emptyprofilepic:emptyPic,
            rowsPerPage: 5,
            page: 0
        }
        this.statusFilter = this.statusFilter.bind(this)
    }

    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage
        })
    };

    handleChangeRowsPerPage = (event) => {
        let rowsPerPage = parseInt(event.target.value, 10)
        this.setState({
            page: 0,
            rowsPerPage: rowsPerPage
        })
    };

    statusFilter(e){
        console.log(e)
        this.setState({
            status:e.target.value
        })
    }

    componentDidMount() {
        this.setState({ studentId: localStorage.getItem('studentId') })
        this.props.getStudentRegistrations()
        // axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        // axios.get(environment.baseUrl+'/student/eventregistrations/' + localStorage.getItem('studentId'))
        //     .then((response) => {
        //         console.log(response.data)
        //         if (response.data) {
        //         this.setState({
        //             registrations: response.data
        //         });
        //     }
        //     })
    }

    render(){
        let eventregistrations = null;
        let registrations = this.props.registrations
        if (registrations.length){
            if (this.state.status){
                registrations=registrations.filter((app) => {
                    return this.state.status.indexOf(app.status) > -1
                })
            }
            eventregistrations = (
                <div>
                {/* {registrations.map((app, index) => { */}
                {registrations.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((app, index) => {
                return (<Card style={{marginBottom:'20px', width:'80%', marginLeft:'150px'}}>
                    <CardContent>
                        <div class="col-md-1" style={{marginTop:'20px'}}>
                            <img src={app.Company[0].image?app.Company[0].image:this.state.emptyprofilepic} height='70' width='70' style={{ position:'relative',top:'-12px',left:'-10px'}} alt='Profile'/></div>
                        <div class="col-md-9" style={{marginBottom:'16px'}}>
                        <div style={{fontSize: '16px', fontWeight: '700' }}>{app.event_name}</div>
                        <div style={{fontSize: '16px', fontWeight: '500' }}>{app.Company[0].name}</div>
                        <div style={{fontSize: '16px', fontWeight: '500'}}><span class="glyphicon glyphicon-map-marker" style={{ color: "#1569E0" }}></span>{app.location}</div>
                        <div>Event is on {app.date} at {app.time}</div></div>
                    </CardContent>
                </Card>)
                })
                }
                <TablePagination style = {{float:'right'}}
                            rowsPerPageOptions={[1, 2, 5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={registrations.length}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                </div>
        )}


       return(<div>
        <StudentNav comp="eventregistrations"/>
        <div style={{ paddingLeft: '5%', paddingRight: '5%', fontFamily: 'Arial' }}>
            {eventregistrations}
        </div>
        </div>
       )
}
}

const mapStateToProps = state => {
    console.log(state)
    return {
        registrations: state.studentregistrations,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getStudentRegistrations : payload => dispatch(getStudentRegistrations(payload)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Registrations);

// export default Registrations;