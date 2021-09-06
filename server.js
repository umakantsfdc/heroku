var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/create', function(req, res) {
    console.log(req.body);
    pg.connect(process.env.DATABASE_URL, function (err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
        conn.query(
            'INSERT INTO salesforce.Feedback__c (Name, Comment__c, Rating__c, Email__c) VALUES ($1, $2, $3, $4)',
                  [req.body.name, req.body.comments, req.body.radio_experience, req.body.email],
            function(err, result) {
               /* if (err != null || result.rowCount == 0) {
                  conn.query('UPDATE salesforce.Feedback__c SET Name = $1, Comment__c = $1 WHERE LOWER(Name) = LOWER($2) AND LOWER(Email) = LOWER($3)',
                  [req.body.name.trim(), req.body.comments.trim(), req.body.radio_experience.trim(), req.body.email.trim()],
                  function(err, result) {*/
                    
                    if (err) {
                        res.status(400).json({error: err.message});
                    }
                    else {
                        // this will still cause jquery to display 'Record updated!'
                        // eventhough it was inserted
                        done();
                        res.json(result);
                    }
                 /* });
                }
                else {
                    done();
                    res.json(result);
                }*/
            }
        );
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
