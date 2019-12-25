const http = require('http');
const port = 3000;
const express = require('express');
const app = express();
const root = __dirname + '/public/';
app.use('/node_modules', express.static('node_modules'));
app.use(express.static('public'));

app.get('/', (request, response) => {
    let options = {
        root: root,
    }
    response.sendFile('index.html', options, function(err){
        if(err){
            console.log('Error');
        }
    });
});
app.listen(port, function(){
	console.log('Server is running on port ' + port);
});