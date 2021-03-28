'use strict';


/**
 * This function creates a Task Object as required
 * 
 * @param {A unique numerical id (required)} id 
 * @param {A textual description (required)} description 
 * @param {Whether is urgent (dafult: false)} isUrgent 
 * @param {Whether it is private (default: true)} isPrivate 
 * @param {A deadline (ie, a date with or without a time. This field is optional)} deadline 
 */
function Task(id, description, isUrgent, isPrivate, deadline){
    this.id = id;
    this.description = description;
    if(isUrgent===undefined)
        this.isUrgent = false;
    else
        this.isUrgent = isUrgent;
    
    if(isPrivate===undefined)
        this.isPrivate = true;
    else
        this.isPrivate = isPrivate;
    
    if(deadline===undefined)
        this.deadline = "<not defined>";
    else
        this.deadline = deadline;

    this.toString = () => (`Id: ${this.id} Description: ${this.description}, Urgent: ${this.isUrgent}, Private: ${this.isPrivate}, Deadline: ${this.deadline}`);
}

/**
 * This function creates a Tasklist object, which is a collection (array) of tasks.
 */
function TaskList() {
    this.tasks = [];

    /**
     * This function adds a task to the collection
     * @param {A task object} task 
     */
    this.add = (task) => {this.tasks.push(task);};

    /**
     * This function sorts tasks by deadline from the closest date to the farest. It also prints on console the result.
     */
    this.sortAndPrint = () => {
        let res = this.tasks.sort((task1,task2) => {

            /** If both dates to compare are undefined, return an equality result */
            if(task1.deadline==="<not defined>" && task2.deadline==="<not defined>")
                return 0;

            /** If one of the two is undefined, return rispectevely task2>task1 (if task1 is undefined) or task2<task1 (if task2 is undefined) */
            if(task1.deadline==="<not defined>")
                return 1;
            if(task2.deadline==="<not defined>")
                return -1;

            return task1.deadline.diff(task2.deadline,'unit');
        });
        //console.log("****** Tasks sorted by deadline (most recent first): ******");
        res.forEach((task) => {
            printHTML(task);
        });
    };

    /**
     * This function filters only task which are urgent and then prints tasks on console.
     */
    this.filterAndPrint = () => {
        let res = [];
        res = this.tasks.filter((task) => (task.isUrgent===true));
        if(res.length>0){
            res.forEach((task) => {
                printHTML(task);
            });
        };
    };
};

function printHTML(task) {
    let listoftask = document.getElementById("listoftask");

    let row = document.createElement("li");
    row.className="list-group-item trans task";
    let item = document.createElement("div");
    item.className="d-flex justify-content-between";

    let rowitem = document.createElement("span");
    rowitem.className="p-0";

    if(task.isUrgent) {
        let rowitem4 = document.createElement("span");
        rowitem4.className = "read";
        rowitem4.innerHTML = '<input type="checkbox" aria-label="Checkbox" class="form-check-input">' + task.description;
        item.appendChild(rowitem4);

        row.classList.add("isUrgent");
    }else{
        rowitem.innerHTML = '<input type="checkbox" aria-label="Checkbox" class="form-check-input">' + task.description;

        row.classList.add("notUrgent");
        item.appendChild(rowitem);
    }

    if(task.isPrivate) {
        let rowitem2 = document.createElement("div");
        rowitem2.className = "p-0";

        rowitem2.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-square" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>
        </svg>`;

        row.classList.add("isPrivate");
        item.appendChild(rowitem2);        
    }else{
        row.classList.add("notPrivate");
    }
    
    if(task.deadline!="<not defined>") {
        let rowitem3 = document.createElement("div");
        rowitem3.className = "p-0";
        rowitem3.innerHTML=dayjs(task.deadline).format('dddd D MMMM YYYY [at] HH:mm').toString();

        item.appendChild(rowitem3);

        //Check isToday
        if(task.deadline.diff(dayjs(),'day')==0){
            row.classList.add("isToday");
        }else{
            row.classList.add("notToday");
        }
        //Check isSevenDays
        if(task.deadline.diff(dayjs(),'day')<=7 && task.deadline.diff(dayjs(),'day')>1){
            row.classList.add("isSeven");
        }else{
            row.classList.add("notSeven");
        }
    }else{
        let rowitem4 = document.createElement("div");
        rowitem4.className = "p-0 invisible";
        rowitem4.innerHTML=dayjs('2021-03-16T10:00').format('dddd D MMMM YYYY [at] HH:mm').toString();
        row.classList.add("notSeven");
        row.classList.add("notToday");
        item.appendChild(rowitem4);
    }

        
    row.appendChild(item);
    listoftask.appendChild(row);
}

function displayAll() {
    let allTask = document.getElementsByClassName("task");
        
    for(let i=0;i<allTask.length;i++){
        allTask[i].classList.remove("d-none");
    }
}

document.addEventListener('DOMContentLoaded', (event)=> {
    tasklist.sortAndPrint();

    //All Filter
    const all = document.getElementById('all');

    all.addEventListener('click', ()=> {
        const active = document.getElementsByClassName("active")[0];
        active.classList="list-group-item list-group-item-action trans";
        active.removeAttribute("aria-current");

        all.classList="list-group-item list-group-item-action active";
        //urgent.setAttribute("disabled",null);
        all.setAttribute("aria-current","true");
    
        const title = document.getElementById("thetitle");
        title.innerText="All";

        displayAll();
        //tasklist.sortAndPrint(); 
    });

    //isUrgent Filter
    const urgent = document.getElementById('isImportant');

    urgent.addEventListener('click', ()=> {
        const active = document.getElementsByClassName("active")[0];
        active.classList="list-group-item list-group-item-action trans";
        active.removeAttribute("aria-current");

        urgent.classList="list-group-item list-group-item-action active";
        //urgent.setAttribute("disabled",null);
        urgent.setAttribute("aria-current","true");
        
        document.getElementById("thetitle").innerText="Important";
        
        displayAll();
        let notUrgent = document.getElementsByClassName("notUrgent");

        for(let i=0;i<notUrgent.length;i++){
            notUrgent[i].classList.add("d-none");
        }

        //tasklist.filterAndPrint(); 
    });
    
    //Today Filter
        const isToday = document.getElementById('isToday');

        isToday.addEventListener('click', ()=> {
            const active = document.getElementsByClassName("active")[0];
            active.classList="list-group-item list-group-item-action trans";
            active.removeAttribute("aria-current");

            isToday.classList="list-group-item list-group-item-action active";
            //urgent.setAttribute("disabled",null);
            isToday.setAttribute("aria-current","true");
    
            document.getElementById("thetitle").innerText="Today";
            displayAll();
            let notToday = document.getElementsByClassName("notToday");
        
            for(let i=0;i<notToday.length;i++){
                notToday[i].classList.add("d-none");
            }
        });

    //Next7Days Filter
        const nextDays = document.getElementById('sevenDays');

        nextDays.addEventListener('click', ()=> {
            const active = document.getElementsByClassName("active")[0];
            active.classList="list-group-item list-group-item-action trans";
            active.removeAttribute("aria-current");

            
            nextDays.classList="list-group-item list-group-item-action active";
            //urgent.setAttribute("disabled",null);
            nextDays.setAttribute("aria-current","true");

            document.getElementById("thetitle").innerText="Next 7 days";
            displayAll();
            let notSeven = document.getElementsByClassName("notSeven");
        
            for(let i=0;i<notSeven.length;i++){
                notSeven[i].classList.add("d-none");
            }
        });

    //isPrivate Filter
        const isPrivate = document.getElementById('isPrivate');

        isPrivate.addEventListener('click', ()=> {
            const active = document.getElementsByClassName("active")[0];
            active.classList="list-group-item list-group-item-action trans";
            active.removeAttribute("aria-current");

            isPrivate.classList="list-group-item list-group-item-action active";
            //urgent.setAttribute("disabled",null);
            isPrivate.setAttribute("aria-current","true");

            document.getElementById("thetitle").innerText="Private";
            //tasklist.sortAndPrint(); 
            displayAll();
            let notPrivate = document.getElementsByClassName("notPrivate");
        
            for(let i=0;i<notPrivate.length;i++){
                notPrivate[i].classList.add("d-none");
            }
        });
});

let tasklist = new TaskList();

let task1 = new Task(1, "laundry");
tasklist.add(task1);
let task2 = new Task(2, "monday lab", false, false, dayjs('2021-03-16T10:00'));
tasklist.add(task2);
let task3 = new Task(3, "phone call", true, false, dayjs('2021-03-08T16:20'));
tasklist.add(task3);
let task4 = new Task(4, "dinner", true, false, dayjs('2021-03-28T18:00'));
tasklist.add(task4);
let task5 = new Task(5, "Meet Douglas", false, false, dayjs('2021-03-31T13:00'));
tasklist.add(task5);
