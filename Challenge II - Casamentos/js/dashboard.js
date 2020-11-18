$(document).ready(function(){

    var url = 'https://sheet2api.com/v1/ByR2h1huRjyQ/fiap/wedding'
    const backgroundColors = ['rgba(234, 128, 121, 1)', 'rgba(104, 191, 183, 1)', 'rgba(255, 184, 84, 1)', 'rgba(219, 93, 121, 1)', 'rgba(132, 184, 226, 1)']

    fetch(url)
    .then(response => response.json())
    .then(data => {
        let doughnutData = stylePrep(data);

        let doughnutOptions = {
            legend: {
                position: 'bottom',
                align: 'end'
            }
        }
        var doughnutQty = new Chart($("#doughnut-qty"), {
            type: 'doughnut',
            data: {
                labels: doughnutData[0],
                datasets: [
                    {
                        data: doughnutData[1],
                        backgroundColor: backgroundColors,                        
                    }
                ]
            },
            options: doughnutOptions
        });

        var doughnutBudget = new Chart($("#doughnut-budget"), {
            type: 'doughnut',
            data: {
                labels: doughnutData[0],
                datasets: [
                    {
                        data: doughnutData[2],
                        backgroundColor: backgroundColors,                        
                    }
                ]
            },
            options: doughnutOptions
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    fetch(url)
    .then(response => response.json())
    .then(data => {
        let barData = timePrep(data);

        let barQtyDatasets = barData[1].map((style, index) => {
            return {
                label: barData[1][index],
                data: barData[2][index],
                backgroundColor: backgroundColors[index]
            }
        })
        let barOptions = {
            scales: {
                xAxes: [{
                    stacked: true,
                    display: false
                }],
                yAxes: [{
                    stacked: true
                }]
            },
            legend: {
                position: 'bottom',
                align: 'end'
            }
        }
        var barQty = new Chart($("#bar-qty"), {
            type: 'horizontalBar',
            data: {
                labels: barData[0],
                datasets: barQtyDatasets
            },
            options: barOptions
        });

        let barBudgetDatasets = barData[1].map((style, index) => {
            return {
                label: barData[1][index],
                data: barData[3][index],
                backgroundColor: backgroundColors[index]
            }
        })

        var barBudget = new Chart($("#bar-budget"), {
            type: 'horizontalBar',
            data: {
                labels: barData[0],
                datasets: barBudgetDatasets
            },
            options: barOptions
        });


    })
    .catch((error) => {
        console.error('Error:', error);
    });
})

var xhttp = new XMLHttpRequest();
XMLHttpRequest.onreadystatechange = function(){
    var json = JSON.parse(this.response);
    console.log(json);
}

const stylePrep = (data) => {
    let weddingStyle = {};

    data.map(item => {
        let style = item.STYLE;
        let budget = typeof item.BUDGET == 'number' ? item.BUDGET : 0;

        if (!weddingStyle[style]){
            weddingStyle[style] = {};
            weddingStyle[style]['qty'] = 0;
            weddingStyle[style]['budget'] = 0;
        }
        weddingStyle[style]['qty'] ++;
        weddingStyle[style]['budget'] += budget;
    });
    
    let styleHeaders = [];
    let styleQty = [];
    let styleBudget = [];

    for (style in weddingStyle) {
        styleHeaders.push(style);
        styleQty.push(weddingStyle[style].qty);
        styleBudget.push(weddingStyle[style].budget);
    }   
    return [styleHeaders, styleQty, styleBudget];
}

const timePrep = (data) => {
    let weddingStyle = {};
    let weddingTime = {};

    data.map(item => {
        let ano = item.WEDDING_DATE.split("-")[0];
        if (ano != 'NULL'){
            let style = item.STYLE;
            let budget = typeof item.BUDGET == 'number' ? item.BUDGET : 0;

            if (!weddingStyle[style]){
                weddingStyle[style] = 0;
            }
            weddingStyle[style]['qty'] ++;
            weddingStyle[style]['budget'] += budget;

            if (!weddingTime[ano]){
                weddingTime[ano] = {};
            }
            if (!weddingTime[ano][style]){
                weddingTime[ano][style] = {};
                weddingTime[ano][style]['qty'] = 0;
                weddingTime[ano][style]['budget'] = 0;
            }
            weddingTime[ano][style]['qty'] ++;
            weddingTime[ano][style]['budget'] += budget;
        }
    });
    
    let timeHeaders = [];
    let timeSubHeaders = [];
    let timeQty = [];
    let timeBudget = [];

    for (year in weddingTime) timeHeaders.push(year);
    for (style in weddingStyle) {
        let qty = [];
        let budget = [];
        for (year in weddingTime){
            if (weddingTime[year][style]){
                qty.push(weddingTime[year][style].qty);
                budget.push(weddingTime[year][style].budget);
            } else {
                qty.push(null);
                budget.push(null);
            }
        }
        timeQty.push(qty);
        timeBudget.push(budget);
        timeSubHeaders.push(style);
    }     
    return [timeHeaders, timeSubHeaders, timeQty, timeBudget];
}