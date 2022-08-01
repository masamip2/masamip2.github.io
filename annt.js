const makeAnnotation = (annt) => {
    return d3.annotation().type(d3.annotationLabel).annotations(annt);
}

const annotation = [{
    note: {
        title: "Overview",
        label: "All the movies",
        wrap: 200,
        align: "middle" },
    connector: { end: "arrow" },
    x: 105,
    y: -15,
    dx: -35,
    dy: 5
}, {
    note: {
        title: "Movies by Decade",
        label: "",
        wrap: 150,
        align: "left" },
    connector: { end: "arrow" },
    x: 1015,
    y: -15,
    dx: 10,
    dy: 12
}].map(function(d){ d.color = "deeppink"; return d });

const annotation_ = [{
    note: {
        title: "Filter by Genre",
        label: "The movies in specific genres can be filtered. 'Multi-Genre' is pre-selected as most of the movies are categorized into multiple genres.",
        wrap: 600,
        align: "middle" },
    connector: { end: "arrow" },
    x: 1060,
    y: 90,
    dx: -220,
    dy: 10
}].map(function(d){ d.color = "deeppink"; return d });

const annotation0 = [{
    note: {
        title: "Movie Detail",
        label: "Hover for basic info, click for more detail and double-click for director's movies.",
        wrap: 300,
        align: "left" },
    connector: { end: "arrow" },
    x: 800,
    y: 750,
    dx: 20,
    dy: 10
}].map(function(d){ d.color = "deeppink"; return d });

const annotation1 = [{
    type: d3.annotationCalloutCircle,
    note: {
        title: "Trend 1",
        label: "The more votes, the higher rating, when the number of votes is around 2 million, even though the gross is not huge.",
        wrap: 430 },
    subject: { "radius": 150 },
    x: 1000,
    y: 350,
    dx: -470,
    dy: -150
}, {
    type: d3.annotationCalloutCircle,
    note: {
        title: "Trend 2",
        label: "The gross is high for some of the good rating movies, when the number of votes is around 1 million. Larger gross does not require more votes and a higher rating.",
        wrap: 420 },
    subject: { "radius": 160 },
    x: 690,
    y: 600,
    dx: -260,
    dy: -250
}, {
    type: d3.annotationCalloutCircle,
    note: {
        title: "Trend 3",
        label: "The fewer votes, the lower rating, when the number of votes is less than half a million. Smaller gross indicates fewer votes and a lower rating.",
        wrap: 370 },
    subject: { "radius": 120 },
    x: 130,
    y: 700,
    dx: 0,
    dy: -210
}].map(function(d){ d.color = "darkorange"; return d });

const annotation2 = [{
    note: {
        title: "Filter by Director",
        label: "Click the director's name to indicate each position of the director's movies in the bubble scatter plot.",
        wrap: 300,
        align: "right" },
    connector: { end: "arrow" },
    x: 1165,
    y: 640,
    dx: -20,
    dy: 10
}].map(function(d){ d.color = "deeppink"; return d });

const annotation3 = [{
    note: {
        title: "Remove the Indicators",
        label: "Click either the director's name again or any of the movies to remove the indicators.",
        wrap: 300,
        align: "right" },
    connector: { end: "arrow" },
    x: 1165,
    y: 640,
    dx: -20,
    dy: 10
}].map(function(d){ d.color = "deeppink"; return d });

const annotation1920_1950 = [{
    type: d3.annotationCalloutCircle,
    note: {
        title: "Analysis for 1920 - 1950",
        label: "Fewer votes, lower ratings and smaller gross amounts seem reasonable due to the limited audience from 1920 to 1950.",
        wrap: 600 },
    subject: { "radius": 100 },
    x: 150,
    y: 600,
    dx: 0,
    dy: -210
}].map(function(d){ d.color = "darkorange"; return d });

const annotation1960 = [{
    type: d3.annotationCalloutCircle,
    note: {
        title: "Analysis for 1960",
        label: "Western movies seem to have increased the number of votes and ratings in the 1960's.",
        wrap: 450 },
    subject: { "radius": 200 },
    x: 380,
    y: 440,
    dx: 0,
    dy: -230
}].map(function(d){ d.color = "darkorange"; return d });

const annotation1970_1980 = [{
    type: d3.annotationCalloutCircle,
    note: {
        title: "Analysis for 1970 - 1980",
        label: "More votes seem to lead to higher ratings in the 1970's and 1980's.",
        wrap: 400 },
    subject: { "radius": 160 },
    x: 720,
    y: 420,
    dx: -200,
    dy: -150
}].map(function(d){ d.color = "darkorange"; return d });

const annotation1990_2000 = [{
    type: d3.annotationCalloutCircle,
    note: {
        title: "Analysis for 1990 - 2000",
        label: "The number of votes around 2 million clearly indicates much higher ratings in the 1990's and 2000's.",
        wrap: 450 },
    subject: { "radius": 150 },
    x: 1000,
    y: 350,
    dx: -450,
    dy: -150
}].map(function(d){ d.color = "darkorange"; return d });

const annotation2010 = [{
    type: d3.annotationCalloutCircle,
    note: {
        title: "Analysis for 2010",
        label: "The number of votes around half a million clearly shows ok ratings in the 2010's.",
        wrap: 400 },
    subject: { "radius": 140 },
    x: 450,
    y: 710,
    dx: 0,
    dy: -320
}].map(function(d){ d.color = "darkorange"; return d });

const annotation2020 = [{
    type: d3.annotationCalloutCircle,
    note: {
        title: "Analysis for 2020",
        label: "The original dataset does not seem to cover the entire year 2020.",
        wrap: 500 },
    subject: { "radius": 140 },
    x: 150,
    y: 700,
    dx: 0,
    dy: -210
}].map(function(d){ d.color = "darkorange"; return d });

let annt = svg.append('g').attr("class", "annotation-group").call(makeAnnotation(annotation)).style("opacity", 1);
let annt_ = svg.append('g').attr("class", "annotation-group").call(makeAnnotation(annotation_)).style("opacity", 0);
let annt0 = svg.append('g').attr("class", "annotation-group").call(makeAnnotation(annotation0)).style("opacity", 0);
let annt1 = svg.append('g').attr("class", "annotation-group").call(makeAnnotation(annotation1)).style("opacity", 0);
let annt2 = svg.append('g').attr("class", "annotation-group").call(makeAnnotation(annotation2)).style("opacity", 0);
let annt3 = svg.append('g').attr("class", "annotation-group").call(makeAnnotation(annotation3)).style("opacity", 0);
let annt1920_1950 = svg.append('g').attr("class", "annotation-group").call(makeAnnotation(annotation1920_1950)).style("opacity", 0);
let annt1960 = svg.append('g').attr("class", "annotation-group").call(makeAnnotation(annotation1960)).style("opacity", 0);
let annt1970_1980 = svg.append('g').attr("class", "annotation-group").call(makeAnnotation(annotation1970_1980)).style("opacity", 0);
let annt1990_2000 = svg.append('g').attr("class", "annotation-group").call(makeAnnotation(annotation1990_2000)).style("opacity", 0);
let annt2010 = svg.append('g').attr("class", "annotation-group").call(makeAnnotation(annotation2010)).style("opacity", 0);
let annt2020 = svg.append('g').attr("class", "annotation-group").call(makeAnnotation(annotation2020)).style("opacity", 0);

function annotate(annt) {

    annt1920_1950.style("opacity", 0);
    annt1960.style("opacity", 0);
    annt1970_1980.style("opacity", 0);
    annt1990_2000.style("opacity", 0);
    annt2010.style("opacity", 0);
    annt2020.style("opacity", 0);

    let all = d3.select("#_All").style("fill") == 'orangered' || annt === 1? 1 : 0;
    annt_.style("opacity", all === 1? 0 : 1);
    //annt0.style("opacity", all === 1? 0 : 1);
    annt1.style("opacity", all === 1? 1 : 0);
    annt2.style("opacity", annt === 2? 1 : 0);
    annt3.style("opacity", annt === 3? 1 : 0);

    let y = d3.select("#year").text();
    if (y && parseInt(annt) > 3) {
        y = parseInt(y);
        if (y >= 1920 && y <= 1950) {
            annt1920_1950.style("opacity", 1);
        } else if (y == 1960) {
            annt1960.style("opacity", 1);
        } else if (y >= 1970 && y <= 1980) {
            annt1970_1980.style("opacity", 1);
        } else if (y >= 1990 && y <= 2000) {
            annt1990_2000.style("opacity", 1);
        } else if (y == 2010) {
            annt2010.style("opacity", 1);
        } else if (y == 2020) {
            annt2020.style("opacity", 1);
        }

    }
}