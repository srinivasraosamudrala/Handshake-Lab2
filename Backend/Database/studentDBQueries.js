exports.studentSignup = "insert into mydb.student (firstname, lastname, email, password, collegename) values (?,?,?,?,? )" ;
exports.studentSignIn = "select * from mydb.student where email = ? and password = ?" ;
exports.studentBasicSelect = "select b.dob,b.city,b.state,b.country,b.career_obj from student s left join student_basic b on b.studentId = s.studentId where s.studentId = ?";
exports.studentInfoSelect = "select * from student where studentId = ?";
exports.studentBasicInsert = "insert into mydb.student_basic (studentId, name, dob, city, state, country, career_obj) values (?,?,?,?,?,?,?)";
exports.studentBasicUpdate = "update mydb.student_basic set name = ?, dob = ?, city = ?, state = ?, country = ?, career_obj = ? where studentId = ?";
exports.studentEducationSelect = "select * from mydb.student_education where studentId = ?";
exports.studentEducationInsert = "insert into mydb.student_education (studentId, college, location, degree, major, year, cgpa) values (?,?,?,?,?,?,?)";
exports.studentEducationUpdate = "update mydb.student_education set college = ?, location = ?, degree = ?, major = ?, year = ?, cgpa = ? where studentId = ?";
exports.studentContactSelect = "select * from mydb.student_contact where studentId = ?";
exports.studentContactInsert = "insert into mydb.student_contact (studentId, phone, email) values (?,?,?)";
exports.studentContactUpdate = "update mydb.student_contact set phone = ?, email = ? where studentId = ?";
exports.studentExperienceSelect = "select * from mydb.student_experience where studentId = ?";
exports.studentExperienceInsert = "insert into mydb.student_experience (studentId, companyName, Title, Location, startDate, endDate, workDesc) values (?,?,?,?,?,?,?)";
exports.studentExperienceUpdate = "update mydb.student_experience set companyName = ?, Title = ?, Location = ?, startDate = ?, endDate = ?, workDesc = ? where studentId = ?";
exports.studentSkillsetSelect = "select skillset from mydb.student_skillset where studentId = ?";
exports.studentSkillsetInsert = "insert into mydb.student_skillset (studentId, skillSet) values (?,?)";
exports.studentSkillsetUpdate = "update mydb.student_skillSet set skillSet = ? where studentId = ?";

exports.StudentProfile='select s.firstName,s.lastName,e.college,s.email,e.degree,e.major,e.cgpa,ss.skillSet from student s left join student_education e on e.studentId=s.studentId left join student_skillset ss on ss.studentId = s.studentId where s.studentId=? order by e.year desc';
exports.StudentWorkProfile='select e.companyName,e.Title,e.Location,e.startDate,e.endDate,e.workDesc from student s left join student_experience e on e.studentId=s.studentId where s.studentId=? order by e.startDate desc';
exports.StudentSkillSet='select ss.skillSet from student s left join student_skillset ss on ss.studentId=s.studentId where s.studentId=?';
exports.studentNameUpdate = 'update mydb.student set firstName = ?,lastName = ? where studentId = ?';
exports.studentCareerObjUpdate = "update mydb.student_basic set career_obj = ? where studentId = ?";
exports.studentBasicSelectall = "select * from mydb.student_basic where studentID = ?";
exports.studentGetJobs = "select j.jobId,j.companyId,c.name,c.profilepic,j.title,j.postingDate,j.deadline,j.location,j.salary,j.jobdesc,j.category,a.status,a.studentId from mydb.jobs j left join company c on c.companyId = j.companyId left join job_applications a on a.jobId = j.jobId and a.studentId = ?"
exports.studentGetApplications = "select * from  mydb.company INNER JOIN mydb.jobs ON  mydb.company.companyId = mydb.jobs.companyId INNER JOIN mydb.job_applications ON  mydb.job_applications.jobId = mydb.jobs.jobId where mydb.job_applications.studentId=?;"
exports.studentApplyJobs = "insert into mydb.job_applications values (?,?,?,?,?,?)" ;
// exports.StudentSearch = "select * from mydb.student where studentId <> ?"
exports.StudentSearch='select s.studentId,s.firstName,s.lastName,s.collegename,e.college,s.email,e.degree,e.major,e.cgpa from student s left join student_education e on e.studentId=s.studentId where s.studentId<>? order by e.year desc';
exports.StudentWorkSearch='select s.studentId,e.companyName,e.Title,e.Location,e.startDate,e.endDate from student s left join student_experience e on e.studentId=s.studentId where s.studentId<>? order by e.startDate desc';
exports.studentBasicSearch = "select s.studentId,s.firstName,s.lastName,s.collegename,s.email,b.dob,b.city,b.state,b.country,b.career_obj from student s left join student_basic b on b.studentId = s.studentId where s.studentId<>?";
exports.getStudentId = "select studentId,profilepic from student where studentId <> ?"

exports.studentGetEvents = "select e.eventId,e.companyId,e.eventname,c.name,c.profilepic,e.time,e.date,e.location,e.eventdesc,e.eligibility from mydb.events e left join company c on c.companyId = e.companyId Order By e.date"
exports.studentGetRegistrations = "select * from  mydb.company INNER JOIN mydb.events ON  mydb.company.companyId = mydb.events.companyId INNER JOIN mydb.event_registration ON  mydb.event_registration.eventId = mydb.events.eventId where mydb.event_registration.studentId=?;"
exports.studentApplyEvents = "insert into mydb.event_registration (studentId,companyId,eventId,eventStatus) values (?,?,?,?)" ;