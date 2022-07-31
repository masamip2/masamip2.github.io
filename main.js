const fields = ["Poster_Link","Series_Title","Released_Year","Runtime","Genre","IMDB_Rating","Overview","Meta_score","Director","Star1","Star2","Star3","Star4","No_of_Votes","Gross"];
function dictFields(data) {
    const dict = {};
    fields.forEach (f => { dict[f] = data[f] });
    return dict;
}

genres = ["Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Drama", "Family", "Fantasy", "Film-Noir", "History", "Horror", "Music", "Musical", "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western"];
function dictGenres(arr) {
    const dict = {};
    genres.forEach (g => { dict[g] = 0 });
    arr.forEach (elm => { dict[elm] = 1 });
    return dict;
}

function selectedGenres() {
    let gs = [];
    genres.forEach (g => {
        if (d3.select(`#-${g}`).style("opacity") == 1) gs.push(g);
    });
    return gs;
}

function findCnt(d, gs) {
    let cnt = 0;
    if (gs.length > 0) {
        const dict = dictGenres(gs);
        genres.forEach (g => {
            if (d[g] == 1 && dict[g] == 1) cnt++
        })
    }
    return cnt == gs.length;
}

let dataset = [];
async function init() {
    data = await d3.csv('imdb_top_1000.csv');
    for (let i = 0; i < data.length; i++) {
        const elms = (data[i].Genre).split(',').map(elm => elm.trim())
        const dict1 = dictFields(data[i])
        const dict2 = dictGenres(elms)
        dataset.push({...dict1, ...dict2})
    }
    changeSlide('All');
}

async function filter(all) {
    all = all? 1 : (d3.select('#_All').style("fill") == 'orangered'? 1 : 0);
    const year = d3.select('#year').text();
    const gs = selectedGenres();

    d3.selectAll("table").remove();

    if (all && gs.length == 0) {
        annotate(1);
        await plot();
    } else {
        annotate(gs.length > 0? 0 : year);
        await plot(dataset.filter(function(d) {
            let d_year = year? d.Released_Year >= parseInt(year) && d.Released_Year < parseInt(year)+10 : true;
            let d_genre = gs.length > 0? findCnt(d, gs) : true;
            return d_year && d_genre;
        }));
    }
}

const margin = {top: 60, right: 50, bottom: 50, left: 50},
    svgsize = {width: 1220, height: 1000},
    legendsize = {width: 300, height: 150},
    infosize = {width: legendsize.width, height: svgsize.height-legendsize.height},
    imgsize = {width: 210, height: 277},
    slidesize = {width: 80, height: 40},
    handlesize = {width: 10, height: 30},
    polyline = {p1: {x: 0, y: 8}, p2: {x: 5, y: 13}, p3: {x: 15, y: 0}},
    boxsize = {width: 15, height: 15},
    genresize = {width: 100, height: 40},
    boxpos = {x: 10, y: 25, distance: 105},
    decades = [1920, 2020],
    slides = ['Prev', 'All', 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 'Next'],
    ranges = [slidesize.width*2+slidesize.width*0.5, slidesize.width*(slides.length-1)-slidesize.width*0.5],
    vizsize = {width: svgsize.width-margin.left-margin.right, height: svgsize.height-margin.top-margin.bottom-slidesize.height-handlesize.height-genresize.height};

function positionYear(decade) { return scale(decade)-20; }
function positionHandle(decade) { return scale(decade)-handlesize.width/2; }

let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

let svg = d3.select("#left").append("svg")
    .attr("width", svgsize.width)
    .attr("height", svgsize.height)
    .append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

const scale = d3.scaleLinear().domain(decades).range(ranges).clamp(true);

let slide = svg.append('g').selectAll("rect").data(slides).enter();
slide.append("rect")
    .attr("class", function(d, i) { return typeof(d) == 'string'? (d == 'All' ? "rect-all" : "rect-nav") : "rect-text" })
    .attr("x", function(d, i) { return slidesize.width*(i) })
    .attr("y", slidesize.height*-1.5)
    .attr("width", slidesize.width)
    .attr("height", slidesize.height)
    .on("mouseover", function(event, d) { overDecade(d, 1) })
    .on("mouseout", function(event, d) { overDecade(d, 0) })
    .on("click", function(event, d) { changeSlide(d) });
slide.append("text")
    .attr("class", function(d, i) { return typeof(d) == 'string'? (d == 'All' ? "slide-all" : "slide-nav") : "slide-text" })
    .attr("x", function(d, i) { return slidesize.width*(i) + slidesize.width*0.5 })
    .attr("y", slidesize.height*-0.8)
    .attr("id", function(d, i) { return `_${d}` })
    .text(function (d, i) { return d })
    .on("mouseover", function(event, d) { overDecade(d, 1) })
    .on("mouseout", function(event, d) { overDecade(d, 0) })
    .on("click", function(event, d) { changeSlide(d) });

svg.append("g").call(d3.axisBottom(scale).tickFormat(d3.format("d")).ticks(11));

let slider = svg.append("g");
slider.append("line")
    .attr("class", "track-line")
    .attr("x1", scale.range()[0])
    .attr("x2", scale.range()[1]);

let handle = slider.append("rect")
    .attr("class", "handle")
    .call(d3.drag()
        .on("start drag", function(event) { changeDecade(parseInt(scale.invert(event.x))) }))
    .attr("width", handlesize.width)
    .attr("height", handlesize.height)
    .attr("x", positionHandle(d3.min(decades)))
    .attr("y", -15);

let year = slider.append("text")
    .attr("class", "year")
    .attr("x", scale(d3.min(decades)))
    .attr("y", -33)
    .attr("id", "year");

const coordinates = [{x: 0, y: 10}, {x: 5, y: 15}, {x: 15, y: 0}];
const checkmark = d3.line(coordinates);
const schemeset = ["sienna", "burlywood", "lightsalmon", "darkgoldenrod", "gold", "khaki", "yellowgreen", "mediumseagreen", "darkseagreen", "olive", "teal", "steelblue", "royalblue", "paleturquoise", "mediumturquoise", "dodgerblue", "pink", "plum", "palevioletred", "mediumslateblue", "mediumorchid"];
const color = d3.scaleOrdinal().domain(genres).range(schemeset);

let genre = svg.append("g").attr("transform", `translate(0, ${boxpos.y})`).selectAll("legend").data(genres).enter();
genre.append("rect")
    .attr("class", "checkbox")
    .attr("x", function (d, i) { return boxpos.x+(boxpos.distance)*(i === 0? 0 : i%11) })
    .attr("y", function (d, i) { return boxpos.y*(i === 0? 1 : parseInt(i/11)+1)+boxsize.height*-0.5 })
    .attr("width", boxsize.width)
    .attr("height", boxsize.height)
    .attr("id", function (d, i) { return `${d}` })
    .style("fill", function (d, i) { return color(d) })
    .on("mouseover", function(event, d) { overGenre(d, 1) })
    .on("mouseout", function(event, d) { overGenre(d, 0) })
    .on("click", function(event, d) { changeGenre(d) });
genre.append("polyline")
    .attr("class", "checkmark")
    .attr("points", function (d, i) {
        const ox = boxpos.x+(boxpos.distance)*(i === 0? 0 : i%11)
        const oy = boxpos.y*(i === 0? 1 : parseInt(i/11)+1)+boxsize.height*-0.5
        return `${ox+polyline.p1.x},${oy+polyline.p1.y}, ${ox+polyline.p2.x},${oy+polyline.p2.y}, ${ox+polyline.p3.x},${oy+polyline.p3.y}`
    })
    .attr("id", function (d, i) { return `-${d}` })
    .style("opacity", 0)
    .on("mouseover", function(event, d) { overGenre(d, 1) })
    .on("mouseout", function(event, d) { overGenre(d, 0) })
    .on("click", function(event, d) { changeGenre(d) });
genre.append("text")
    .attr("class", "genre")
    .attr("x", function (d, i) { return boxpos.x+20+(boxpos.distance)*(i === 0? 0 : i%11) })
    .attr("y", function (d, i) { return boxpos.y*(i === 0? 1 : parseInt(i/11)+1) })
    .attr("id", function (d, i) { return `_${d}` })
    .style("alignment-baseline", "middle")
    .text(function (d, i) { return d })
    .on("mouseover", function(event, d) { overGenre(d, 1) })
    .on("mouseout", function(event, d) { overGenre(d, 0) })
    .on("click", function(event, d) { changeGenre(d) });

let multi = svg.append("g");
multi.append("rect")
    .attr("class", "checkbox-multi")
    .attr("x", boxpos.x+boxpos.distance*10)
    .attr("y", boxpos.y*(2+1)+boxsize.height*-0.5)
    .attr("width", boxsize.width)
    .attr("height", boxsize.height)
    .style("fill", "gainsboro");
multi.append("polyline")
    .attr("class", "checkmark")
    .attr("points", function (d, i) {
        const ox = boxpos.x+(boxpos.distance)*10
        const oy = boxpos.y*(2+1)+boxsize.height*-0.5
        return `${ox+polyline.p1.x},${oy+polyline.p1.y}, ${ox+polyline.p2.x},${oy+polyline.p2.y}, ${ox+polyline.p3.x},${oy+polyline.p3.y}`
    })
    .style("opacity", 1);
multi.append("text")
    .attr("class", "genre-multi")
    .attr("x", boxpos.x+20+(boxpos.distance)*10)
    .attr("y", boxpos.y*(2+1))
    .style("alignment-baseline", "middle")
    .text("Multi-Genre");

function overDecade(y, o) {
    if (!(y == 'All' && d3.select("#_All").style("fill") == 'orangered')) {
        d3.select(`#_${y}`).style("fill", o? "darkorange" : (typeof(y) == 'string'? "whitesmoke" : "slategray"));
    }
}

function changeDecade(y) {
    genres.forEach (v => { d3.select(`#-${v}`).style("opacity", 0) });
    d3.selectAll(".checkbox").attr("cursor", (y == 'All'? "default" : "pointer"));
    d3.selectAll(".genre").attr("cursor", (y == 'All'? "default" : "pointer"));
    d3.select('#_All').style("fill", y == 'All'? "orangered" : "whitesmoke");
    const decade = y == 'All'? d3.min(decades) : Math.round(y/10)*10;
    handle.attr("x", positionHandle(decade));
    year.attr("x", scale(decade)).style("opacity", y == 'All'? 0 : 1).text(y == 'All'? '' : decade);
    filter(y == 'All'? 1 : 0);
}

function changeSlide(v) {
    if (typeof(v) == 'string') {
        if (v != 'All') {
            let y = d3.select("#year").text();
            if (y) {
                y = parseInt(y);
                if (v == 'Prev') {
                    if (parseInt(d3.min(decades)) < y) {
                        v = y - 10;
                    } else {
                        v = 'All';
                    }
                } else if (v == 'Next' && y < parseInt(d3.max(decades))) {
                    v = y + 10;
                } else {
                    return;
                }
            } else {
                if (v == 'Next') {
                    v = parseInt(d3.min(decades));
                } else {
                    return;
                }
            }
        }
    }
    changeDecade(v);
}

function overGenre(g, o) {
    if (d3.select("#_All").style("fill") != 'orangered') {
        if (d3.select(`#-${g}`).style("opacity") == 0) {
            d3.select(`#${g}`).style("opacity", o? 1 : 0.8).style("stroke-width", o? 2 : 1);
            d3.select(`#_${g}`).style("opacity", o? 1 : 0.8);
        }
    }
}

function changeGenre(g) {
    if (d3.select("#_All").style("fill") != 'orangered') {
        let o = d3.select(`#-${g}`).style("opacity");
        d3.select(`#-${g}`).style("opacity", o == 1? 0 : 1);
        filter(0);
    }
}

let x = d3.scaleSqrt().domain([25000, 2350000]).range([0, vizsize.width]);
let y = d3.scaleLinear().domain([7.5, 9.5]).range([vizsize.height, 0]);
let z = d3.scaleSqrt().domain([1, 1000000000]).range([5, 50]);

let xAxis = svg.append("g").attr("transform", `translate(0, ${slidesize.height+handlesize.height+genresize.height+vizsize.height})`).call(d3.axisBottom(x).ticks(5));
svg.append("text").attr("text-anchor", "end").attr("x", vizsize.width-(margin.right*0.5)).attr("y", slidesize.height+handlesize.height+genresize.height*2+vizsize.height-margin.bottom*1.25).text("Votes").attr("fill", "slategray");

let yAxis = svg.append("g").attr("transform", `translate(0, ${slidesize.height+handlesize.height+genresize.height})`).call(d3.axisLeft(y).ticks(5));
svg.append("text").attr("text-anchor", "end").attr("x", margin.left*0.5).attr("y", slidesize.height+handlesize.height+genresize.height+margin.bottom*0.5).text("Rating").attr("fill", "slategray").attr("text-anchor", "start");

function formatNumber(num) {
    const n = typeof(num) == 'string'? parseInt(num.replace(/,/g,'')) : num;
    if (n >= 1000 && n < 1000000) {
        return (n/1000).toFixed(1) + 'K';
    } else if (n >= 1000000) {
        return (n/1000000).toFixed(1) + 'M';
    }
    return n;
}

const grosses = [1000000000, 100000000, 10000000];
const circlepos = {x: 60, y: 75};

let legend = d3.select("#right").append("svg")
    .attr("width", legendsize.width)
    .attr("height", legendsize.height)
    .append("g").attr("transform", `translate(0, ${margin.top})`);

let diagram = legend.selectAll("legend").data(grosses).enter();
diagram.append("circle")
    .attr("class", "circle-shape")
    .attr("cx", circlepos.x)
    .attr("cy", function (d, i) { return circlepos.y - z(d) })
    .attr("r", function (d, i) { return z(d) })
diagram.append("line")
    .attr("class", "circle-line-dash")
    .attr("x1", function (d, i) { return circlepos.x+z(d) })
    .attr("x2", function (d, i) { return circlepos.x+z(d)+70 })
    .attr("y1", function (d, i) { return circlepos.y-z(d) })
    .attr("y2", function (d, i) { return circlepos.y-z(d) });
diagram.append("text")
    .attr("class", "circle-text")
    .attr("x", function (d, i) { return circlepos.x+z(d)+100 })
    .attr("y", function (d, i) { return circlepos.y-z(d)+5 })
    .text(function (d, i) { return `$ ${formatNumber(d)}` });

legend.append("text")
    .attr("class", "circle-text")
    .attr('x', circlepos.x)
    .attr("y", circlepos.y-115)
    .text("Gross $(M) & Genre");
legend.append("line")
    .attr("class", "circle-line")
    .attr("x1", circlepos.x)
    .attr("x2", circlepos.x+60)
    .attr("y1", circlepos.y-80)
    .attr("y2", circlepos.y-80);
legend.append("text")
    .attr("class", "circle-text")
    .attr("x", circlepos.x+135)
    .attr("y", circlepos.y-80)
    .text("color: indicating genre");

let info = d3.select("#right").append("div")
    .attr("class", "info")
    .attr("width", infosize.width)
    .attr("height", infosize.height);

function convertString(str, prepend) { return `${prepend? '_' : ''}${str.replace(/[^a-zA-Z0-9]/g, '_')}` }

function clearDirector() {
    d3.selectAll("circle").filter('.bubble-bg').style("stroke", "orangered").style("opacity", 0);
}

function overDirector(o) {
    if (d3.select('.button').style("opacity") == 0.8) {
        d3.select('.button').style("border-color", o? "orangered" : "slategray");
    }
}

function indicateDirector(title, director) {
    annotate(3);
    let o = d3.select('.button').style("opacity");

    d3.selectAll("circle").filter(`.${convertString(director)}`).style("opacity", o == 1? 0 : 1);
    d3.select(`#${convertString(title, 1)}`).style("stroke", "gray").style("opacity", 1);
    d3.select('.button').style("opacity", o == 1? 0.8 : 1);
}

function removeBubbles() {
    d3.selectAll("circle").filter('.bubble-bg').remove();
    d3.selectAll("circle").filter('.bubble').remove();
}

let bubbleBk = null;
async function plot(data) {

    removeBubbles();

    let bubble = svg.append('g').attr("transform", `translate(0, ${genresize.height*2})`).selectAll("circle").data(data? data : dataset).enter();

    if (!bubbleBk) {
        bubbleBk = bubble.append("circle")
        .attr("class", 'bubble-bk')
        .attr("cx", function (d) { return x(d.No_of_Votes) })
        .attr("cy", function (d) { return y(d.IMDB_Rating) })
        .attr("r", function (d) { return z(d.Gross? (d.Gross).replace(/,/g, '') : 1) })
        .style("fill", function (d) {
            const gs = (d.Genre).split(',').map(elm => elm.trim())
            return gs.length == 1? color(gs[0]) : "gainsboro"
        });
    }

    if (!data) return;

    bubble.append("circle")
        .attr("class", function (d) { return `bubble-bg ${convertString(d.Director)}` })
        .attr("id", function (d) { return convertString(d.Series_Title, 1) })
        .attr("cx", function (d) { return x(d.No_of_Votes) })
        .attr("cy", function (d) { return y(d.IMDB_Rating) })
        .attr("r", function (d) { return z(d.Gross? (d.Gross).replace(/,/g, '') : 1) });
    bubble.append("circle")
        .attr("class", 'bubble')
        .attr("cx", function (d) { return x(d.No_of_Votes) })
        .attr("cy", function (d) { return y(d.IMDB_Rating) })
        .attr("r", function (d) { return z(d.Gross? (d.Gross).replace(/,/g, '') : 1) })
        .style("fill", function (d) {
            const gs = (d.Genre).split(',').map(elm => elm.trim())
            return gs.length == 1? color(gs[0]) : "gainsboro"
        })
        .on("mouseover", function(event, d) {
            d3.select(this).style("stroke", "darkslategray");
            tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            tooltip.html(`Year: ${d.Released_Year}<br>Votes: ${d.No_of_Votes}<br>Rating: ${d.IMDB_Rating}<br>Gross: $ ${d.Gross? formatNumber(d.Gross) : 'N/A'}`)
                .style("left", (event.pageX+20) + "px")
                .style("top", (event.pageY+20) + "px");
        })
        .on("mouseout", function(event, d) {
            d3.select(this).style("stroke", "white");
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("mousemove", function(event, d) {
        })
        .on("dblclick", function(event, d) {
            clearDirector();
            d3.select(`#${convertString(d.Series_Title, 1)}`).style("stroke", "gray").style("opacity", 1);
            indicateDirector(d.Series_Title, d.Director);
        })
        .on("click", function(event, d) {
            annotate(2);
            clearDirector();
            d3.select(`#${convertString(d.Series_Title, 1)}`).style("stroke", "gray").style("opacity", 1);

            info.html(`
                <table>
                    <tr class="tr-img">
                        <td colspan="2">
                            <div class="img">
                                <img src="${(d.Poster_Link).split('._V1_U')[0]}" width=${imgsize.width} height=${imgsize.height} alt="Movie Image">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>Released Year</th>
                        <td>${d.Released_Year}</td>
                    </tr>
                    <tr>
                        <th>IMDB Rating</th>
                        <td>${d.IMDB_Rating}</td>
                    </tr>
                    <tr>
                        <th>Number of Votes</th>
                        <td>${d.No_of_Votes}</td>
                    </tr>
                    <tr>
                        <th>Gross</th>
                        <td>$ ${d.Gross? d.Gross : 'N/A'}</td>
                    </tr>
                    <tr>
                        <th>Series Title</th>
                        <td>${d.Series_Title}</td>
                    </tr>
                    <tr>
                        <th>Genre</th>
                        <td>${d.Genre}</td>
                    </tr>
                    <tr>
                        <th>Director</th>
                        <td><input type="button" class="button" onmouseover="overDirector(1)" onmouseout="overDirector(0)" onclick="indicateDirector('${d.Series_Title}', '${d.Director}')" value="${d.Director}"></td>
                    </tr>
                    <tr>
                        <th>Overview</th>
                        <td>${d.Overview}</td>
                    </tr>
                </table>
            `);
        });

    if (selectedGenres().length == 0) bubbleBk.style("opacity", 0.6).transition().duration(2000).style("opacity", 0);
}