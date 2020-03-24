exports.companySignup = "insert into mydb.company (name, email, password, location) values (?,?,?,? )" ;
exports.companySignIn = "select companyId from mydb.company where email = ? and password = ?" ;
exports.getJobList = "select * from mydb.jobs where companyId = ?"
exports.getEventList = "select * from mydb.events where companyId = ?"
exports.postjob = "insert into mydb.jobs (companyId,title,postingDate,deadline,location,salary,jobdesc,category) values (?,?,?,?,?,?,?,?)"
exports.postevent = "insert into mydb.events (companyId,eventname,eventdesc,time,date,location,eligibility) values (?,?,?,?,?,?,?)"
exports.listApplicants="select * from mydb.job_applications INNER JOIN mydb.student ON  mydb.job_applications.studentId = mydb.student.studentId where companyId=? and jobId=?;"
exports.listRegistrations="select * from mydb.event_registration INNER JOIN mydb.student ON  mydb.event_registration.studentId = mydb.student.studentId where companyId=? and eventId=?;"
exports.updateStudentstatus="update mydb.job_applications set status=? where companyId =? and jobId = ? and studentId = ?"
exports.getCompanyProfile = "select * from mydb.company where companyId = ?"
exports.updateCompanyProfile ="update mydb.company set name=?,location=?,email=?,Phone=? where companyId=?"