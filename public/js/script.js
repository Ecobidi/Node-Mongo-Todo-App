window.onload = function(){
    var GET = function(url){
        return new Promise(function(resolve, reject){
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.send();
            xhr.onload = function(){
                if(xhr.status === 200){
                    resolve(xhr.response);
                }
            }
        });
    };
    
    var POST = function(url, data){
        return new Promise(function(resolve, reject){
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(data);
            xhr.onload = function(){
                if(xhr.status === 200){
                    resolve(xhr.response);
                }
            }
        });
    };

    var DELETE = function(url, todo){
        return new Promise(function(resolve, reject){
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', url);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(todo));
            xhr.onload = function(){
                if(xhr.status === 200){
                    resolve(xhr.response);
                }
            }
        });
    };
    (function onLoad(){
        //immediately the window loads then make a GET request to the server
        GET('/todos')
        //and then render the response
        .then(function(response){
            console.log(response);
            renderhtml(JSON.parse(response));
        });
    })();

    function a(response){
        console.log(response);
    }

   /* GET('/css/style.css').then(function(response){
        console.log(response);
    }) */

    //DOM MANIPULATION
    var form = document.querySelector('form'),
        list = document.querySelector('.todo-list');
        input = document.querySelector('input[type="text"]');

    form.addEventListener('submit', function(e){
        e.preventDefault();
        var text = input.value;
        //empty the input field content
        input.value = "";
        //make a POST request to the server
        POST('/todo/new', JSON.stringify(text))
        //then append the task to the todo-list
        .then(function(){
            appendOne(text);
        })
    });
    
    //event propagation
    list.addEventListener('click', function(e){
        if(e.target.tagName.toLowerCase() === "li"){
            var text = e.target.innerText;
            //make a DELETE request
            DELETE('/todo/delete', text)
            .then(function(response){
                var response = JSON.parse(response);
                console.log(response);
                renderhtml(response);
            })
        }
    });

    // this renders the entire todo-list
    function renderhtml(todos){
        //empty the contents of the task-list ul
        list.innerHTML = '';
        todos.forEach(function(task){
            appendOne(task.title);
        });
    };
    //this appends just one task to the todo-list
    function appendOne(task){
        var li = document.createElement('li');
        li.className = 'task';
        li.innerText = task;
        list.insertBefore(li, list.firstChild);
    }
};