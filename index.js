var a=[];
var list=document.getElementById("list");
var list1="";
var count=0;

if(localStorage.getItem("a")===null)
localStorage.setItem("a",JSON.stringify(a))
else{
a=JSON.parse(localStorage.getItem("a"));
 for(var i=0;i<a.length;i++){
  list1=list1+"<div class='elements' id='"+i+"' onclick='getresponse(this)'><h3>"+a[i].subject+"</h3>"+a[i].question+"</div><hr class='hrline'>";
  count++;
 }
list.innerHTML=list1;
}

//To add questions-----------------------------------
function addquestion(){
var subject=document.getElementById("subject").value;
var question=document.getElementById("question").value;

if(subject=="" || question==""){
    alert("Subject or Question missing");
    return;
}

a.push({subject: subject, question: question, response:[]});
       localStorage.setItem("a",JSON.stringify(a));
list1=list1+"<div class='elements' id='"+count+"' onclick='getresponse(this)'><h3>"+a[count].subject+"</h3>"+a[count].question+"</div><hr class='hrline'>";
list.innerHTML=list1;
count++;

var form=document.getElementsByTagName("form");
       form[0].reset();

       var query={subject: subject, question: question, response:[]}
       var http=new XMLHttpRequest();
       http.open("POST","/addquestion");
       http.setRequestHeader('Content-Type','application/json; charset=utf-8');
       http.send(JSON.stringify(query));
       
       http.addEventListener("load", function(event){
           console.log(JSON.parse(event.target.responseText));
           location.reload();
       });
}

//To display response form-----------------------------
var ele; //ele=clicked question
function getresponse(element){
    ele=element;
    var x=document.getElementsByClassName("container2");
    x[0].style.display='none';
    var y=document.getElementsByClassName("container3");
    y[0].style.display='block';

           document.getElementById("displayquestion").innerHTML=element.innerHTML;
           
           console.log(element.innerHTML);

           var rlist="";
           for(var i=0;i<a[ele.id].response.length;i++){
               rlist+="<div><h6>"+a[ele.id].response[i].name+"</h6>"+a[ele.id].response[i].response+"</div><hr class='hrrline'>";
           }
           document.getElementById("addresponse").innerHTML=rlist;
           var form=document.getElementsByTagName("form");
           form[0].reset();


}

//To display responses--------------------------------
function displayresponse(){
    var responselist="";
    var name=document.getElementById("name").value;
    var response=document.getElementById("response").value;

    if(name=="" || response==""){
        alert("Enter name and comment.");
        return;
    }

    var count=a[ele.id].response.length;
    a[ele.id].response.push({name: name,response: response});

    for(var i=0;i<a[ele.id].response.length;i++){
    responselist=responselist+"<div style='padding-left: 5px;'><h6>"+a[ele.id].response[i].name+"</h6>"+a[ele.id].response[i].response+"</div><hr class='hrrline'>";
    }
   document.getElementById("addresponse").innerHTML=responselist;
   var form=document.getElementsByTagName("form");
           form[1].reset();
    console.log(a);

    localStorage.setItem("a",JSON.stringify(a));

    var answers={name: name,response: response};
    var http=new XMLHttpRequest();
    http.open("POST","/addresponse/"+a[ele.id].subject);
    http.setRequestHeader('Content-type','application/json; charset=utf-8');
    http.send(JSON.stringify(answers));

    http.addEventListener("load", function(event){
           location.reload();
    })
}

//To remove questions----------------------------
function resolved(){
    
    var http=new XMLHttpRequest();
    http.open("DELETE","/resolvequestion/"+a[ele.id].subject);
    http.setRequestHeader('Content-type','application/json; charset=utf-8');
    http.send(JSON.stringify(ele));

    http.addEventListener("load", function(event){
        console.log(JSON.parse(event.target.responseText));
        location.reload();
    })


    a.splice(ele.id,1);
    list1="";
    for(var i=0;i<a.length;i++){
        list1=list1+"<div class='elements' id='"+i+"' onclick='getresponse(this)'><h3>"+a[i].subject+"</h3>"+a[i].question+"</div><hr class='hrline'>";
    }
    list.innerHTML=list1;
    localStorage.setItem("a",JSON.stringify(a));



    newform();
}

//To hide and display question form and response form--------
function newform(){
    var x=document.getElementsByClassName("container3");
    x[0].style.display='none';
    var x1=document.getElementsByClassName("container2");
    x1[0].style.display='block';
}

//To search in the questions-----------------------
function search(){
    var input= document.getElementById("input").value;
    input=input.toUpperCase();
    if(input==""){
        list.innerHTML=list1;
        return;
    }
    var hr=document.getElementsByClassName("hrline");
    var a=document.getElementsByClassName("elements");
    var text,flag=0;
    for(var i=0;i<a.length;i++){
        text=a[i].textContent || a[i].innerText;
        if(text.toUpperCase().indexOf(input)>-1){
            a[i].style.display="";
        }
        else{
            a[i].style.display="none";
            hr[i].style.display='none';
            flag++;
        }
    }

    if(flag==a.length){
        document.getElementById("list").innerHTML="<h3>No match found</h3>";
    }
}