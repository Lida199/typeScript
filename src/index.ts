// value-ს მიწითლებს რატომღაც
//ჯავასკრიპტ ფაილი რომ მივიღოთ ჯერ npm run gettingScript უნდა გავუშვათ,შემდეგ კი შეიძლება npm start-ის გაშვებაც 

document.getElementById("btn").addEventListener("click", function(){
    const result : string= document.getElementById("movie").value.trimStart().trimEnd();
    document.getElementById("country").innerHTML = " ";
    document.getElementById("timeSince").innerHTML = " ";
    document.getElementById("actors").innerHTML = " ";
    const request : Promise<Response> = fetch(`http://www.omdbapi.com/?apikey=5190dd47&t=${result}`);
    request.then(response => response.json())
    .then(json => displayingDetails(json.Year, json.Actors, json.Country))
    .catch(() => {document.getElementById("timeSince").innerHTML = "Please check the title and try again"});
});

function displayingDetails(year : string, actors : string, country : string) : void{
    let time : string;
    if (2022 - Number.parseInt(year) == 0) {
        time = "Movie was released this year"
    } else if(2022 - Number.parseInt(year) == 1){
        time = "Movie was released last year"
    } else(
        time = `Movie was released ${2022 - Number.parseInt(year)} years ago`
    );
    document.getElementById("timeSince").textContent = time;
    const actorsArr : string[]= actors.split(", ");
    const actorsFinal : string[]= [];
    actorsArr.forEach(el => {
        let index : number = el.indexOf(" ");
        let added : string = el.slice(0, index);
        actorsFinal.push(added);
    });
    document.getElementById("actors").innerText = actorsFinal.join(", ");
    const countries : string[] = country.split(", ");
    countries.forEach(country => {
        console.log(country);
        const request1 : Promise<Response> = fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`);
        request1.then(response1 => response1.json())
        .then(json1 => {
            creatingCountryDetails(json1[0].currencies, json1[0].cca2)
        }). catch(()=> console.log("onside error"))
    });
    
}


function creatingCountryDetails(currency : any, code : string) : void{
    let currencyName : string, currencySymbol : string;
    for(let key in currency){
        currencyName = currency[key].name;
        currencySymbol = currency[key].symbol;
    }
    const div = document.createElement("div");
    const img = document.createElement("img");
    img.src = `https://flagpedia.net/data/flags/icon/36x27/${code.toLowerCase()}.png`;
    div.append(`${currencyName} - ${currencySymbol} `,img);
    document.getElementById("country").append(div);
}

document.getElementById("btn1").addEventListener("click", function(){
    const value1 : string = document.getElementById("movie1").value.trimStart().trimEnd();
    const value2 : string = document.getElementById("movie2").value.trimStart().trimEnd();
    const value3 : string = document.getElementById("movie3").value.trimStart().trimEnd();
    document.getElementById("runtime").textContent = ` `;
    document.getElementById("population").textContent = ` `;
    const arr : string[]= [value1, value2, value3];
    let runtime : number = 0;
    let population : number = 0;
    async function details(){
        for(let i = 0; i < arr.length; i++){
            const request2 = await fetch(`http://www.omdbapi.com/?apikey=5190dd47&t=${arr[i]}`);
            const response2 = await request2.json();
            runtime += Number.parseInt(response2.Runtime);
            const countriesHere : string[] = response2.Country.split(", ");
            for(let i = 0; i< countriesHere.length; i++){
                const request3 = await fetch(`https://restcountries.com/v3.1/name/${countriesHere[i]}?fullText=true`);
                const response3= await request3.json();
                population += Number(response3[0].population);
            }         
        }
        document.getElementById("runtime").textContent = `${runtime} minutes`;
        document.getElementById("population").textContent = `${population} people`;
    }
    details();
});
