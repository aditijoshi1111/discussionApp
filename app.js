const express=require('express');
const app=express();
var fs=require('fs');

app.use(express.static('./'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", function(req,res){
    console.log("yes get");
    fs.readFile("./index.html", function(err, data){
        if(err) console.log("error");
        else{
            res.writeHead(200,{'Content-type' : 'text/html'});
            res.write(data);
            res.end();
        }
    })
})
app.post("/addquestion", function(req,res){
    fs.readFile("database.json",'utf-8',function(err,data){
        var d=JSON.parse(data);
        d.data.push(req.body);
        res.json(d);

        fs.writeFile("./database.json",JSON.stringify(d),function(err){
            if(err) console.log(err);
        })
    })
});
app.delete("/resolvequestion/:subject", function(req,res){
    console.log("yes delete");
    fs.readFile("database.json", 'utf-8', function(err,data){
        var d=JSON.parse(data);
        console.log(req.params.subject);
        d.data= d.data.filter( items =>{
            return items.subject != req.params.subject;
        })
        res.json(d);

        fs.writeFile("./database.json",JSON.stringify(d),function(err){
            if(err) console.log(err);
        })
    });
});
app.post("/addresponse/:subject",function(req,res){
    fs.readFile("database.json",function(err,data){
        var d=JSON.parse(data);
        d.data.filter(items=>{
            return items.subject == req.params.subject;
        })[0].response.push(req.body);
        console.log(d+"---"+typeof d+"---"+JSON.stringify(d));

        fs.writeFile("./database.json",JSON.stringify(d),function(err){
            if(err) console.log(err);
        })
    });
})
app.listen(5500);
