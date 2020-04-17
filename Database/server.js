var connection =  new require('./kafka/connection');
//topics files
//var signin = require('./services/signin.js');
var companyRepo = require('./Repository/companyRepo');
var studentRepo = require('./Repository/studentRepo');
var chatRepo = require('./Repository/chatRepo');
var dbconnection = require('./dbConnection');

function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, (err,res) => {
            console.log(res)
            console.log(err)
            if (res){
                result = res
            }else{
                result = err
            }
            console.log(`after handle :`);
            console.log(result)
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : result
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}


async function handleTopicRequestAsync(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    await consumer.on('message',async function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        let res = await fname.handle_request(data.data)
        // fname.handle_request(data.data, (err,res) => {
            // console.log(res)
            // console.log(err)
            // if (res){
            //     result = res
            // }else{
            //     result = err
            // }
            // console.log(`after handle :`);
            console.log(res)
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            await producer.send(payloads, async function(err, data){
                console.log(data);
            });
            return;
        });
        
    // });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("login-signup",companyRepo)
handleTopicRequest("company-jobs",companyRepo)
handleTopicRequest("company-events",companyRepo)
handleTopicRequest("company-profile",companyRepo)
handleTopicRequest("student_signin",studentRepo)
handleTopicRequest("student-jobs",studentRepo)
handleTopicRequest("student-events",studentRepo)
handleTopicRequest("student-profile",studentRepo)
handleTopicRequestAsync("chat",chatRepo)
