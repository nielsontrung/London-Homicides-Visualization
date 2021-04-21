const svg = d3.select('svg');

const weaponsColour = {
    Arson: "#FF0000",
    "Blunt Object": "#cc79a7",
    Gun: "#0072b2",
    Knife: "#f0e442",
    Ligature: "#D81B60",
    None: "#1E88E5",
    Other: "#000000",
    Poison: "#FFFF00",
    Strangulation: "#F32AD1",
    Vehicle: "#0FF022"};

const weaponsIcon = {
    Arson: "\uf7e4",
    "Blunt Object": "\uf6e3",
    Gun: "\uf05b",
    Knife: "\uf506",
    Ligature: "\uf5b7",
    None: "\uf057",
    Other: "\uf059",
    Poison: "\uf714",
    Strangulation: "\uf6de",
    Vehicle: "\uf5e1"};

const sexOfVicSus = {MM: "#0000FF",
    MF: "#FFFF00",
    FM: "#000000",
    FF: "#FF8C00",
    F: "#FF00FF",
    M: "#0FF022"};

let boroughKillFreq = {
    2012: {},
    2013: {},
    2014: {},
    2015: {},
    2016: {},
    2017: {},
    2018: {}};

let maxDead = 0;

let color = d3.scaleLinear()
    .domain([0, 10])
    .range(["white", "red"]);


let weaponsFreq = {
    2012: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2013: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2014: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2015: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2016: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2017: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2018: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]};

let sexFreq = {
    2012: [0, 0, 0, 0, 0, 0],
    2013: [0, 0, 0, 0, 0, 0],
    2014: [0, 0, 0, 0, 0, 0],
    2015: [0, 0, 0, 0, 0, 0],
    2016: [0, 0, 0, 0, 0, 0],
    2017: [0, 0, 0, 0, 0, 0],
    2018: [0, 0, 0, 0, 0, 0]};

(function (d3,topojson) {
    'use strict';
    var mapScale = 45000;
    var mapTranslateX = 540;
    var mapTranslateY = mapScale * 0.99388888888888;




    const projection = d3.geoPatterson()
        .scale(mapScale)
        .translate([mapTranslateX, mapTranslateY]);
    const pathGenerator = d3.geoPath().projection(projection);

    svg.append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({type: 'Sphere'}));





    d3.selection.prototype.moveToFront = function() {
        return this.each(function(){
            this.parentNode.appendChild(this);
        });
    };
    d3.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };

    d3.json('london.json')
        .then(data => {
            const countries = topojson.feature(data, data.objects.london_geo);
            svg.selectAll('path').data(countries.features)
                .enter().append('path')
                .attr('id', 'boroughs')
                .attr('class', 'country')
                .attr('d', pathGenerator)

            for (let y = 0; y < 7; y++) {
                let boroYear = (2012 + y).toString();
                for (let x = 0; x < countries.features.length; x++) {
                    boroughKillFreq[boroYear][countries.features[x]['id']] = 0;
                }
            }
        });
    setTimeout(function(){
        d3.csv('homicideEdit.csv')
            .then(data => {


                data.forEach(d => {

                    let yrr = d.date.substring((d.date.length-4),(d.date.length));

                    if (d.weapon == "Arson") weaponsFreq[yrr][0]++;
                    else if (d.weapon == "Blunt Object") weaponsFreq[yrr][1]++;
                    else if (d.weapon == "Gun") weaponsFreq[yrr][2]++;
                    else if (d.weapon == "Knife") weaponsFreq[yrr][3]++;
                    else if (d.weapon == "Ligature") weaponsFreq[yrr][4]++;
                    else if (d.weapon == "None") weaponsFreq[yrr][5]++;
                    else if (d.weapon == "Other") weaponsFreq[yrr][6]++;
                    else if (d.weapon == "Poison") weaponsFreq[yrr][7]++;
                    else if (d.weapon == "Strangulation") weaponsFreq[yrr][8]++;
                    else if (d.weapon == "Vehicle") weaponsFreq[yrr][9]++;


                    let sexCode = d.vicsex + d.sussex;
                    if (sexCode == "MM") sexFreq[yrr][0]++;
                    else if (sexCode == "MF") sexFreq[yrr][1]++;
                    else if (sexCode == "FM") sexFreq[yrr][2]++;
                    else if (sexCode == "FF") sexFreq[yrr][3]++;
                    else if (sexCode == "F") sexFreq[yrr][4]++;
                    else if (sexCode == "M") sexFreq[yrr][5]++;


                    boroughKillFreq[yrr][d.ladnm] ++;
                    if (boroughKillFreq["2012"][d.ladnm] > maxDead) maxDead = boroughKillFreq["2012"][d.ladnm];
                });


                var g = svg.selectAll('points').data(data)
                    .enter()
                    .append("g");
                g.append("text")
                    .attr("class", d=> {
                        let year = d.date.substring((d.date.length-4),(d.date.length));
                        let sexCode = d.vicsex + d.sussex;
                        return "fa "+d.weapon+" Y-"+year + " " + sexCode;})
                    .attr("id", d=> {return d.date +" " + d.weapon;})
                    .attr('text-anchor', 'middle')
                    .attr('visibility', function(d) {
                        if (d.date.substring((d.date.length-4),(d.date.length)) == "2012") return "visible";
                        else return "hidden";
                    })
                    .attr("x", function(d) {
                        return projection([d.longitude, d.latitude])[0];
                    })
                    .attr("y", function(d) {return projection([d.longitude, d.latitude])[1];})
                    .attr("font-size","10px")
                    // .style("stroke", "#000000")
                    .style("fill", function(d) {
                        let sexCode = d.vicsex + d.sussex;
                        return sexOfVicSus[sexCode];
                    })
                    .text(function(d) {return weaponsIcon[d.weapon];})
                    .on("mouseover", function(d){
                        d3.select(this)
                            // .moveToFront()
                            // .transition()
                            .style("fill", "orange")
                            .attr("font-size","24px")
                            .append("svg:title")
                            .text(d => { return d.date + "\nVictim Age: " + d.vicage +"\nVictim Sex: "
                                +d.vicsex + "\nVictim Ethinicity: "+d.vicethnic + "\nSuspect Sex: "+d.sussex
                                + "\nBorough: "+d.ladnm;})
                    })
                    .on("mouseout", function(d){
                        d3.select(this).transition()
                            .style("fill", function(d) {
                                let sexCode = d.vicsex + d.sussex;
                                return sexOfVicSus[sexCode];
                            })
                            .attr("font-size","12px")
                        // .moveToBack()
                        d3.select(this)
                            .select("text").remove();
                    })
                    .on("click", function(d){
                        d3.select(this)
                    });

            });

        setTimeout(function(){
            updateMap("2012");
        }, 500);
    }, 500);

    //weapon legend
    let weapons = ["Arson", "Blunt Object", "Gun", "Knife", "Ligature", "None", "Other", "Poison", "Strangulation", "Vehicle"];

    let sexData = ["MM", "MF", "FM", "FF", "F", "M"];
    let sexText = ["M/M", "M/F", "F/M", "F/F", "F/?", "M/?"];

    let weaponColors = ["#FF0000", "#cc79a7", "#0072b2","#f0e442", "#D81B60", "#1E88E5", "#000000", "#FFFF00", "#F32AD1", "#0FF022"];

    let icons = ["\uf7e4","\uf6e3","\uf05b", "\uf506", "\uf5b7", "\uf057", "\uf059", "\uf714", "\uf6de", "\uf5e1"];


    svg.append("text")
        .attr("x", 860)
        .attr("y", 60)
        .style("font-size", "20px")
        .text("Legend:");

    svg.append("text")
        .attr("x", 860)
        .attr("y", 80)
        .style("font-size", "16px")
        .text("Murder Weapon");

    svg.append("text")
        .attr("x", 860)
        .attr("y", 350)
        .style("font-size", "16px")
        .text("Sex of Victim/Suspect");

    svg.append("text")
        .attr("x", 860)
        .attr("y", 520)
        .style("font-size", "16px")
        .text("Freq. of Murders");

    d3.csv('homicideEdit.csv')
        .then(data=>{
            svg.selectAll("weapon-icons")
                .data(icons)
                .enter()
                .append("text")
                .attr("class", "fa legend")
                .attr("font-family", "FontAwesome")
                .attr("font-size", "18px")
                .attr("x", 860)
                .attr("y", function(d,i) { return 100 + i*25;})
                .text(function(d) {return d;});
            svg.selectAll("weapon-label")
                .data(weapons)
                .enter()
                .append("text")
                .attr("x", 900)
                .attr("y", function(d,i) { return 100 + i*25;})
                .attr("text-anchor", "left")
                .text(function(d) { return d});
            svg.selectAll("sex-data")
                .data(sexData)
                .enter()
                .append("rect")
                .attr("x", 860)
                .attr("y", function(d,i) { return 360 + i*25;})
                .style("position", "absolute")
                .style("width", "15px")
                .style("height", "15px")
                .style("fill", function(d) { return sexOfVicSus[d];});
            svg.selectAll("sex-label")
                .data(sexText)
                .enter()
                .append("text")
                .attr("x", 900)
                .attr("y", function(d,i) { return 373 + i*25;})
                .text(function(d) {return d;});

            svg.append("text")
                .attr("x", 860)
                .attr("y", 535)
                .style("font-size", "14px")
                .text("0");

            svg.append("text")
                .attr("class", "freqEnder")
                .attr("x", 995)
                .attr("y", 535)
                .style("font-size", "14px")
                .text("4");


            let xR = 4;
            for (let x = 0; x < 10; x++) {
                svg.append("rect")
                    .attr("x", 860+xR)
                    .attr("y", 540)
                    .style("position", "absolute")
                    .style("width", "15px")
                    .style("height", "15px")
                    .style("fill", color(x));
                xR += 14;
            }






        });

}(d3,topojson));



function updateMap(theYear) {
    d3.json('london.json')
        .then(data => {

            maxDead = 0;
            let len = Object.keys(boroughKillFreq[theYear]).length;
            let keys = Object.keys(boroughKillFreq[theYear]);
            for (let x = 0; x < len; x++) {
                if (boroughKillFreq[theYear][keys[x]] > maxDead) maxDead = boroughKillFreq[theYear][keys[x]];
            }



            const countries = topojson.feature(data, data.objects.london_geo);
            const divider = maxDead/10;

            var tooltip = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("visibility", "hidden")
                .style("text-align", "center")
                .style("width", "80px")
                .style("height", "60px")
                .style("padding", "2px")
                .style("font-size", "12px")
                .style("background", "lightsteelblue")
                .style("border", "0px")
                .style("border-radius", "8px")
                .text(function (d) {
                    //var txt = d.id + "\n" + boroughKillFreq[d.id] + " deaths";
                    return "banana";
                });


            d3.selectAll(".freqEnder").text(maxDead);



            var xz = svg.selectAll('path#boroughs').attr('class', 'borough')
                .attr('fill', function(d) {
                    var num = Math.ceil(boroughKillFreq[theYear][d.id]/divider);
                    return color(num);

                    //if (boroughKillFreq[d.id] > 10) return'#FF0000';
                    //return '#90EE90';
                })
                .attr("opacity", ".85")
                .style("stroke","grey")
                .style("stroke-width", "0.5")
                .on("mouseover", function(d){
                    d3.select(this).transition()
                        .duration('50')
                        .attr('opacity', '1')
                        .style("stroke-width", "1")
                    // .style("stroke", "black");
                    return tooltip.style("visibility", "visible").text(d.id + "\n\n" + boroughKillFreq[theYear][d.id] + " deaths");
                })
                .on("mousemove", function(d){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
                .on("mouseout", function(d){
                    d3.select(this).transition()
                        .duration('50')
                        .attr('opacity', '.85')
                        .style("stroke", "grey")
                        .style("stroke-width", "0.5");

                    return tooltip.style("visibility", "hidden");
                });

        });
}






const margins = {top: 200, right: 300, bottom: 0, left: 300};

function barsplot(currYear = 0, yearClass = ".Y-2012") {

    let weapons = ["Arson", "Blunt", "Gun", "Knife", "Ligature",
        "None", "Other", "Poison", "Strangulation", "Vehicle"];

    let sexes = ["MM","MF","FM","FF","F","M"];


    let weaponFreq2 = [0, 4,6, 45,3, 35,9, 0,0, 1];
    let sexFreq2 = [68, 4,21, 3,1, 6];

    if (currYear != 0) {
        weaponFreq2 = weaponsFreq[currYear];
        sexFreq2 = sexFreq[currYear];
    }


    let weaponColors = ["grey", "grey", "grey","grey", "grey", "grey", "grey", "grey", "grey", "grey"];

    let sexColours = ["#0000FF", "#FFFF00", "#000000","#FF8C00", "#FF00FF", "#0FF022"];

    let chart = d3.select("svg");
    // if (chart.select(".inner").empty()) makeInnerArea(chart);

    //scales
    let xscale = d3.scaleBand(weapons, [0, 800])
        .padding(100);
    let yscale = d3.scaleLinear([0, 450], [400, 0]);

    //axes
    let xaxis = d3.axisBottom(xscale);
    let yaxis = d3.axisLeft(yscale);
    let axes = [xaxis, yaxis];

    //bars
    let bars = chart.selectAll(".bar").data(weaponFreq2);

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("id", function(d,i){
            return weapons[i];})
        .merge(bars)
        .attr("y", function(d,i) { return i*25 + 87;})
        .attr("x", (d,i) => (1000))
        .attr("height", xscale.bandwidth() + 17 )
        .attr("width", function(d,i) { return weaponFreq2[i] * 3;})
        .attr("fill", function(d,i) { return weaponColors[i] ;})
        .on("mouseover", function(d){
            d3.select(this)
                // .moveToFront()
                // .transition()
                .style("fill", "orange")
                .append("svg:title")
                .text(function(d) {
                    return d;
                });
            d3.selectAll(("." + this.id)).attr("font-size", "22px");
        })
        .on("mouseout", function(d) {
            d3.select(this).transition()
                .style("fill", function (d) {
                    return weaponColors[weaponFreq2.indexOf(d)];
                })
                .attr("font-size", "12px")
            d3.select(this)
                .select("text").remove();
            d3.selectAll(("." + this.id)).attr("font-size", "10px");
        })
        .on("click", function(d){
            console.log(this.id);
            d3.selectAll(".fa").attr("visibility", "hidden");
            d3.selectAll(".legend").attr("visibility", "visible");
            d3.selectAll(("." + this.id + yearClass)).attr("visibility", "visible");
        })
        .on("dblclick", function(d){
            d3.selectAll(".fa").attr("visibility", "hidden");
            d3.selectAll(".legend").attr("visibility", "visible");
            d3.selectAll(yearClass).attr("visibility", "visible");
        });




    //bars
    let bars2 = chart.selectAll(".bar2").data(sexFreq2);

    bars2.enter()
        .append("rect")
        .attr("class", "bar2")
        .attr("id", function(d,i){
            return sexes[i];})
        .merge(bars2)
        .attr("y", function(d,i) { return i*25 + 360;})
        .attr("x", (d,i) => (1000))
        .attr("height", xscale.bandwidth() + 17 )
        .attr("width", function(d,i) { return sexFreq2[i] * 3;})
        .attr("fill", function(d,i) { return sexColours[i] ;})
        .on("mouseover", function(d){
            d3.select(this)
                // .moveToFront()
                // .transition()
                .style("fill", "orange")
                .append("svg:title")
                .text(function(d) {
                    return d;
                });
            d3.selectAll(("." + this.id)).attr("font-size", "22px");
        })
        .on("mouseout", function(d) {
            d3.select(this).transition()
                .style("fill", function (d) {
                    return sexColours[sexFreq2.indexOf(d)];
                })
                .attr("font-size", "12px")
            d3.select(this)
                .select("text").remove();
            d3.selectAll(("." + this.id)).attr("font-size", "10px");
        })
        .on("click", function(d){
            d3.selectAll(".fa").attr("visibility", "hidden");
            d3.selectAll(".legend").attr("visibility", "visible");
            d3.selectAll(("." + this.id + yearClass)).attr("visibility", "visible");
        })
        .on("dblclick", function(d){
            d3.selectAll(".fa").attr("visibility", "hidden");
            d3.selectAll(".legend").attr("visibility", "visible");
            d3.selectAll(yearClass).attr("visibility", "visible");
        });
}


let sliderr = document.querySelector('input');

sliderr.addEventListener('input', function () {
    slider(this)
}, false);





function slider(input){
    const years = [2012,2013,2014,2015,2016,2017,2018];
    document.getElementById("demo").innerText = input.value;
    let homicides;
    let yearClass = ".Y-" + input.value;


    d3.selectAll(".fa").attr("visibility", "hidden");
    d3.selectAll(".legend").attr("visibility", "visible");
    d3.selectAll(yearClass).attr("visibility", "visible");

    barsplot(input.value, yearClass);
    updateMap(input.value);

}