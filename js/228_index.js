var nowSection = 0;
var mouseNow = {x: 0, y: 0};
var mouseMoveHandler;
var timer;
var story_tip_width = 350, story_tip_height = 200;
var startingTop = 0, startingLeft = 0;
var storyDict = {};
var agebar_heightMap = {};

var blur_count2 = 0;
var blur_count5 = 0;
var blur_count6 = 0;
var blur_count7 = 0;
var sec2count = 0;
var sec5count = 0;
var sec6count = 0;
var sec7count = 0;

var moneybar_heightMap = {};
var allmoney = 0;
var random_min = 9;
var random_max = 99;
var regiontoEngDict = {};
var tipMarginNow = 44;
var tipIndexNow = 1;
var timelineDictList = [];
var regiontextDict = {};

$(document).ready(function() {
  $('#fullpage').fullpage({
    anchors: ['firstPage', 'secondPage', '3rdPage', '4thPage', '5thPage', '6thPage', '7thPage', '8thPage'],
    sectionsColor: [],//['#C63D0F', '#1BBC9B', '#7E8F7C', '#C63D0F', '#1BBC9B', '#7E8F7C', '#C63D0F', '#1BBC9B'],
    // scrollOverflow: true,
    // verticalCentered: false,
    normalScrollElements: '#sec8-scrolling',
    navigation: true, 
    navigationPosition: 'right',
    navigationTooltips: ['First page', 'Second page', 'Third and last page'],


    afterLoad: function(anchorLink, index){
      nowSection = index;
      $("#region-content").css("display", "table");
      $("#region-content-invis").css("display", "none");
      $("#story-img").fadeOut(1);
      $("#story-tip").fadeOut(1);

      if(nowSection == 2){
        if(sec2count == 0){
          sec2count++;
          clearTimeout(timer);
          timer = setTimeout(sec2Blur,500);

        }
        
      }
      else if(nowSection == 4){
        // console.log(storyDict);

        document.addEventListener('mousemove', mouseMoveHandler = function(e){ 
          mouseNow.x = e.clientX || e.pageX;
          mouseNow.y = e.clientY || e.pageY;
          // console.log(mouseNow);
          dis = Math.round(Math.sqrt(Math.pow(startingTop - event.clientY, 2) + 
                                    Math.pow(startingLeft - event.clientX, 2)));
          // console.log(dis);
          $("#story-img").fadeIn("fast");
          if(dis > 80){
            $("#story-tip").css("display", "none");//fadeOut("fast");
            d3.select("#story-block").selectAll("canvas").remove();
            startingTop = mouseNow.y;
            startingLeft = mouseNow.x;
            
            $("#story-block").css("top", mouseNow.y);
            $("#story-block").css("left", mouseNow.x);
            var r = getRandomInt(1,4);
            var r_story = getRandomInt(0,2264);
            // console.log(r);
            var img_name = "../img/little-man-" + r.toString() + ".png"
            document.getElementById("little-man").src = img_name;

            var s = storyDict[r_story]["detail"].replace("受難者", "我");
            s = s.substring(0, s.length - 1);
            var ss = storyDict[r_story]["name"].replace("?", "Ｏ");
            // console.log(s);
            var name_length = ss.length;
            var invis = "";
            var name_mod = "";
            for (var i = 0; i < name_length - 2; i++){
              invis = invis + "Ｏ";
            }
            if(name_length == 2){
              name_mod = ss[0] + "Ｏ";
            }
            else{
              name_mod = ss[0] + invis + ss[name_length - 1];
            }

            // console.log(name_mod);
            var story_text = "我是" + name_mod + "，在" + s + "，當時我" + storyDict[r_story]["age"] + "歲...";
            // console.log(story_text);
            document.getElementById("story-tip").innerHTML = story_text;

            clearTimeout(timer);
            timer=setTimeout(mouseStopped,300);
          }

          
        }, false);
      

      }

      else if(nowSection == 5){
        if(sec5count == 0){
          sec5count++;
          clearTimeout(timer);
          timer = setTimeout(sec5Blur,500);
        }
      }

      else if(nowSection == 6){
        if(sec6count == 0){
          sec6count++;
          clearTimeout(timer);
          timer = setTimeout(sec6Blur,500);
          // numChange();
        }
      }

      else if(nowSection == 7){
        if(sec7count == 0){
          sec7count++;
          clearTimeout(timer);
          timer = setTimeout(sec7Blur,500);
          // numChange();
        }
      }

      else if (nowSection == 8){
        clearTimeout(timer);
        timer = setTimeout(showBackToPrev,3000);
      }

      if(nowSection != 4){
        document.removeEventListener('mousemove', mouseMoveHandler, false);
      }
      
      // var loadedSection = $(this);

      //using index
      // if(index == 3){
      //   alert("Section 3 ended loading");
      // }

      //using anchorLink
      // if(anchorLink == 'secondSlide'){
      //   alert("Section 2 ended loading");
      // }
    }
  });
  
  $('.carousel').carousel({
    interval: false
  });
  for (var i = 0; i < 8; i++){
    d3.select("#sec8-all-img").append("img").attr("src", "img/08-littleman-onTheRecord.png");
  }

  d3.select("#sec8-all-img").append("img").attr("src", "img/08-littleman-half.png");

  for (var i = 0; i < 171; i++){
    d3.select("#sec8-all-img").append("img").attr("src", "img/08-littleman-offTheRecord.png");
  }
  
});

d3.csv("data/stories.csv", function(data_stories){
  storyDict = data_stories;
});

d3.csv("data/county-english-name.csv", function(data_region_english){
  for (var i in data_region_english){
    regiontoEngDict[data_region_english[i]['region']] = data_region_english[i]['english'];
  } 
});

d3.csv("data/map_content.csv", function(data_region_text){
  for (var i in data_region_text){
    regiontextDict[data_region_text[i]['cName']] = data_region_text[i]['text'];
  } 
});

d3.csv("data/page-seven.csv", function(data_page7){
  timelineDictList = data_page7;
  // console.log(timelineDictList);
});

d3.csv("data/age_peopleNum.csv", function(data_age){
  var w = 630,h = 270,padding = 10, barMargin = 2;

  var xScale = d3.scale.linear() 
    .domain([0, 7]) 
    .range([padding , w - padding- 200]) 

  var yScale = d3.scale.linear()
    .domain([0, 1022])
    .range([padding, h - padding])

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    var s = getAgeRange(d.age);
    var per = (((d.number/2265)*100).toFixed(2)).toString() + "%";
    return "<div><strong>年齡:</strong> <span style='color:#e94f3c'>" + s + "</span></div><div style='margin-top:10px'><strong>比例: </strong> <span style='color:#e94f3c'>" + per + "</span></div>";
  })

  var svg_age = d3.select('#age-bar').append('svg').attr({'width': w,'height': h});

  svg_age.call(tip);

  svg_age.selectAll('rect').data(data_age).enter() 
  .append('rect') 
  .attr({ 
    'x': function(d){
      if(d.age > 3){
        return xScale(d.age) + 200
      }
      else 
        return xScale(d.age)
    },
    'y': function(d){return h}, //- yScale(d.number)}, 
    'width': 10,
    'height':function(d){
      agebar_heightMap[d.age] = h - yScale(d.number);
      return yScale(d.number)
    },
    'class':function(d){
      return "age-bar-" + d.age;
    },
    'fill': function(d){
      return  "#e94f3c";
    }
    // 'title': function(d){
    //   return 'Name : ' + d.age;
    // }

  })
  .style("stroke", "black")
  .style("stroke-width", "5px")
  .on("mouseover", function(d){
    tip.show(d);
    document.getElementById("age-peonum-num").innerHTML = d.number;
    $("#age-text").css("display", "none");
    $("#age-peonum").css("display", "table");
  })
  .on("mouseout", function(d){
    tip.hide(d);
    $("#age-text").css("display", "table");
    $("#age-peonum").css("display", "none");
  });

});

d3.json("data/tw_county_topo_mod.json", function (data) {
  d3.csv("data/region_peopleNum.csv", function(data_region){


    topo = topojson.feature(data, data.objects.layer1);

    var region_map = {}

    for (var i in data_region){
      region_map[data_region[i]['region']] = data_region[i]['number'];
    }

    prj = d3.geo.mercator().center([120.971864, 23.960998])
      .scale(7000).translate([240, 320]);
    path = d3.geo.path().projection(prj);

    for(i = 0; i < topo.features.length; i ++ ) {
      if(topo.features[i].properties.COUNTYNAME == "雲林縣" && topo.features[i].properties.COUNTYSN != "10009012"){
        topo.features[i].properties.value = 0;
      }
      else if(topo.features[i].properties.COUNTYNAME == "台東縣" && topo.features[i].properties.COUNTYSN != "10014070"){
        topo.features[i].properties.value = 0;
      }
      else if(topo.features[i].properties.COUNTYNAME == "屏東縣" && topo.features[i].properties.COUNTYSN != "10013005"){
        topo.features[i].properties.value = 0;
      }
      else if(topo.features[i].properties.COUNTYNAME == "宜蘭縣" && topo.features[i].properties.COUNTYSN != "10002058"){
        topo.features[i].properties.value = 0;
      }
      else if(topo.features[i].properties.COUNTYNAME == "澎湖縣" && topo.features[i].properties.COUNTYSN != "10016197"){
        topo.features[i].properties.value = 0;
      }
      else if(topo.features[i].properties.COUNTYNAME == "連江縣" || topo.features[i].properties.COUNTYNAME == "金門縣"){
        topo.features[i].properties.value = 0;
        console.log(topo.features[i].properties.COUNTYSN);
      }
      else{
        topo.features[i].properties.value = region_map[topo.features[i].properties.COUNTYNAME];
      }
    }

    // console.log(topo.features);

    var Rmax = d3.max(data_region, function(d){return parseInt(d['number'])}),
        Rmin = d3.min(data_region, function(d){return parseInt(d['number'])});

    radiusMap = d3.scale.linear()
                  .domain([0,Rmax])
                  .range([0,52]);

    //width =  $(".container").width()/2 > 560? 560: $(".container").width()/2; // 800
    width = 450;
    height = 720; //780

    var svg = d3.select('#region-chart').append('svg').attr({'width': width, 'height': height});

    var block = svg.append("g")
              .attr("id","map-g")
              .selectAll("path").data(topo.features).enter()
              .append("path")
              .attr("d",path)
              .attr("fill", function(d){
                return "white";
              })
              .attr("stroke","black")
              .attr("stroke-width", "1.0");

    var dorling = d3.select("#region-chart svg").selectAll("circle").data(topo.features).enter()
      .append("circle")
      .each(function(it) {
      it.properties.r = radiusMap(it.properties.value);
      it.properties.c = path.centroid(it);
      it.properties.x = 400;
      it.properties.y = 300;
      // console.log(it);

      })
      .attr("cx",function(it) { return it.properties.x + it.properties.c[0] - 400; })
      .attr("cy",function(it) { return it.properties.y + it.properties.c[1] - 300; })
      .attr("r", function(it) { return it.properties.r; })
      .attr("fill", "#e94f3c")
      .style("opacity", "0.8")
      .on("mouseover",function(it){
        // console.log(it.properties.COUNTYNAME);
        d3.select("#region-invis-littlecircle").selectAll("circle").transition().duration(500).attr("r", it.properties.r);
        d3.select(this).style("opacity", "1");
        document.getElementById("region-invis-map-name").innerHTML = it.properties.COUNTYNAME;
        document.getElementById("region-invis-peonum").innerHTML = region_map[it.properties.COUNTYNAME] + "人";
        var s = "../img/" + regiontoEngDict[it.properties.COUNTYNAME] + ".png";
        console.log(s);
        document.getElementById("region-map-img").src = s;
        $("#region-content").css("display", "none");
        document.getElementById("region-invis-bot").innerHTML = regiontextDict[it.properties.COUNTYNAME];
        $("#region-content-invis").css("display", "table");
      })
      .on("mouseout", function(it){
        d3.select(this).style("opacity", "0.8");
      });

    var svg_region = d3.select("#region-invis-littlecircle").append("svg").attr({'width': 240, "height": 200});

    svg_region.append("circle").attr("cx", 120).attr("cy", 100).attr("r", 20).attr("fill", "#e94f3c");

    forceNodes = [];
    for(i = 0 ; i < topo.features.length ; i++ ) {
      if(topo.features[i].properties.value != 0)
        forceNodes.push(topo.features[i].properties);
    }
    // force layout, makes circles closer.
    // This is useful when circle radius changes.
    // console.log(forceNodes);
    force = d3.layout.force().gravity(3.0).size([800,600]).charge(-1).nodes(forceNodes);

    force.on("tick", function() {
      for(i = 0 ; i < topo.features.length ; i++) {
        for(j = 0 ; j < topo.features.length ; j++) { 
          it = topo.features[i].properties; 
          jt = topo.features[j].properties; 
          if(i==j) continue; 
          // not collide with self 
          r = it.r + jt.r; 
          // it.c is the centroid of each county and initial position of circle 
          itx = it.x + it.c[0]; ity = it.y + it.c[1]; jtx = jt.x + jt.c[0]; jty = jt.y + jt.c[1]; 
          // distance between centroid of two circles 
          d = Math.sqrt((itx - jtx) * (itx - jtx) + (ity - jty) * (ity - jty)) ; 
          if(r > d) { 
            // there's a collision if distance is smaller than radius
            dr = ( r - d ) / ( d * 1 );
            it.x = it.x + ( itx - jtx ) * dr;
            it.y = it.y + ( ity - jty ) * dr;
          }
        }
      }
      dorling.attr("cx",function(it) { return it.properties.x + it.properties.c[0] - 400; })
          .attr("cy",function(it) { return it.properties.y + it.properties.c[1] - 300; });
    });
    
    force.start();

  });       
});

d3.csv("data/money_peopleNum.csv", function(data_money){
  var w = 500,h = 400,padding = 10, barMargin = 2;

  var xScale = d3.scale.linear() 
    .domain([0, 12]) 
    .range([padding , w - padding - 100]); 

  var yScale = d3.scale.linear()
    .domain([0, 830])
    .range([padding, h - padding]);

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    var s = getMoneyRange(d.money);
    var per = (((d.number/2264)*100).toFixed(2)).toString() + "%";
    // console.log(per);
    return "<div><strong>補償金額: </strong> <span style='color:#e94f3c'>" + s + "</span></div><div style='margin-top:10px'><strong>人數: </strong> <span style='color:#e94f3c'>" + d.number + "</span></div><div style='margin-top:10px'><strong>比例: </strong> <span style='color:#e94f3c'>" + per + "</span></div>";
  });

  var svg_money = d3.select('#sec5-chart').append('svg').attr({'width': w,'height': h});

  svg_money.call(tip);

  svg_money.selectAll('rect').data(data_money).enter() 
  .append('rect') 
  .attr({ 
    'x': function(d){
        return xScale(d.money) + 50;
    },
    'y': function(d){return h;},// - yScale(d.number);}, 
    'width': 15,
    'height':function(d){
      moneybar_heightMap[d.money] = h - yScale(d.number);
      return yScale(d.number);
    },
    'class':function(d){
      return "money-bar-" + d.money;
    },
    'fill': function(d){
      return  "#e94f3c";
    }
    // 'title': function(d){
    //   return 'Name : ' + d.age;
    // }

  })
  .on("mouseover", function(d){
    tip.show(d);
  })
  .on("mouseout", function(d){
    tip.hide(d);
  });
  
});

function mouseStopped(){
  
  $("#story-tip").fadeIn(300);

  var tip_width = document.getElementById("story-tip").clientHeight;
  console.log(tip_width);

  var canvasHeight = 100 - (tip_width/2);
  var canvasWidth = 90;

  d3.select("#story-canvas").append("canvas").attr({"width": canvasWidth, "height": canvasHeight, "id": "myCanvas"});
  $("#story-canvas").css({"top": -canvasHeight, "left": 140 - canvasWidth});

  var c=document.getElementById("myCanvas");
  var ctx=c.getContext("2d");
  ctx.moveTo(0, canvasHeight);
  ctx.lineTo(canvasWidth, 0);
  ctx.lineWidth=2;
  ctx.strokeStyle="#FFFFFF";
  ctx.stroke();
  
  
  startingTop = mouseNow.y;
  startingLeft = mouseNow.x;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getAgeRange(ageIndex){
  switch(ageIndex){
    case '0':
      return "0歲~10歲";
    case '1':
      return "11歲~20歲";
    case '2':
      return "21歲~30歲";
    case '3':
      return "31歲~40歲";
    case '4':
      return "41歲~50歲";
    case '5':
      return "51歲~60歲";
    case '6':
      return "61歲~70歲";
    case '7':
      return "71歲~80歲";
  }
}

function getMoneyRange(ageIndex){
  switch(ageIndex){
    case '0':
      return "10萬~40萬";
    case '1':
      return "50萬~90萬";
    case '2':
      return "100萬~140萬";
    case '3':
      return "150萬~190萬";
    case '4':
      return "200萬~240萬";
    case '5':
      return "250萬~290萬";
    case '6':
      return "300萬~340萬";
    case '7':
      return "350萬~390萬";
    case '8':
      return "400萬~440萬";
    case '9':
      return "450萬~490萬";
    case '10':
      return "500萬~540萬";
    case '11':
      return "550萬~590萬";
    case '12':
      return "600萬";
  }
}

function sec2Blur(){
  blur_count2++;
  $("#section1").blurjs({
    source: "#section1",
    radius: 20,
    overlay: 'rgba(0,0,0,0.12)',
    offset: {     //Pixel offset of background-position
      x: "center",
      y: "center"
    }
  });
  if(blur_count2 > 5) {
    d3.select("#age-title-block").transition().duration(2000).style("opacity", "1");
    d3.select("#age-text").transition().duration(2000).style("opacity", "1");
    d3.select("#age-littleman").transition().duration(2000).style("opacity", "1");
    for(var i = 0; i < 8; i++){
      d3.select('#age-bar').selectAll(".age-bar-" + i.toString()).transition().duration((i+1) * 500 + 2000).attr("y", agebar_heightMap[i.toString()]);
    }
    return;
  }
  // if(r > 50) return;
  // console.log("wtf");
  clearTimeout(timer);
  timer = setTimeout(sec2Blur,50);
}

function sec5Blur(){
  blur_count5++;
  $("#section4").blurjs({
    source: "#section4",
    radius: 15,
    overlay: 'rgba(0,0,0,0.15)',
    offset: {     //Pixel offset of background-position
      x: "center",
      y: "center"
    }
  });
  d3.select("#section4-blur").transition().duration(1000).style("opacity", "1");
  if(blur_count5 > 5){ 
    d3.select("#sec5-content").transition().duration(2000).style("opacity", "1");
    for(var i = 0; i < 13; i++){
      if(i == 12)
        d3.select('#sec5-chart').selectAll(".money-bar-" + i.toString()).transition().duration(3000).attr("y", moneybar_heightMap[i.toString()]);
      else
        d3.select('#sec5-chart').selectAll(".money-bar-" + i.toString()).transition().duration((i) * 500 + 2000).attr("y", moneybar_heightMap[i.toString()]);
    }
    return;
  }
  // if(r > 50) return;
  // console.log("wtf");
  clearTimeout(timer);
  timer = setTimeout(sec5Blur,50);
}

function sec6Blur(){
  blur_count6++;
  $("#section5").blurjs({
    source: "#section5",
    radius: 15,
    overlay: 'rgba(0,0,0,0.15)',
    offset: {     //Pixel offset of background-position
      x: "center",
      y: "center"
    }
  });
  if(blur_count6 > 5) {
    d3.select('#totalmoney').transition().duration(80).style("opacity", "1");
    numChange();    
    return;
  }

  clearTimeout(timer);
  timer = setTimeout(sec6Blur,50);
}

function sec7Blur(){
  blur_count7++;
  $("#section6").blurjs({
    source: "#section6",
    radius: 15,
    overlay: 'rgba(0,0,0,0.15)',
    offset: {     //Pixel offset of background-position
      x: "center",
      y: "center"
    }
  });
  if(blur_count7 > 5) {
    d3.select('#sec7-container').transition().duration(2000).style("opacity", "1");   
    return;
  }

  clearTimeout(timer);
  timer = setTimeout(sec7Blur,50);
}

function numChange(){
  var r = getRandomInt(random_min,random_max);
  random_min = random_min * 1.4;
  random_max = random_max * 1.4;
  allmoney += parseInt(r);
  // console.log(allmoney);
  
  if(allmoney >= 7168800000){
    allmoney = 7168800000;
    document.getElementById("totalmoney").innerHTML = modNum(allmoney.toString());
    $("#totalmoney").css("color", "transparent");
    d3.select('#totalmoney').transition().duration(2000).style("background-image", "url(../img/totalmoney.png)");
    d3.select('#sec6-title').transition().duration(2000).style("opacity", "1");
    d3.select('#myCarousel').transition().duration(2000).style("opacity", "1");
    return;
  }

  document.getElementById("totalmoney").innerHTML = modNum(allmoney.toString());
  clearTimeout(timer);
  timer = setTimeout(numChange, 43);
}

function modNum(str){
  var str1, str2, str3, str4;
  var finalStr;
  if(str.length > 9){
    str1 = str.substr(str.length - 3, 3);
    str2 = str.substr(str.length - 6, 3);
    str3 = str.substr(str.length - 9, 3);
    str4 = str.substr(0, str.length - 9);
    finalStr = str4 + ',' + str3 + ',' + str2 + ',' + str1;
  }
  else if(str.length > 6){
    str1 = str.substr(str.length - 3, 3);
    str2 = str.substr(str.length - 6, 3);
    str3 = str.substr(0, str.length - 6);
    finalStr = str3 + ',' + str2 + ',' + str1;
  }
  else if (str.length > 3){
    str1 = str.substr(str.length - 3, 3);
    str2 = str.substr(0, str.length - 3);
    finalStr = str2 + ',' + str1;
  }
  else{
    finalStr = str;
  } 

  return finalStr; 
}

function moveTip(idx){
  var dif = idx - tipIndexNow;
  tipMarginNow = tipMarginNow + dif * 120;
  // console.log(tipMarginNow);
  tipIndexNow = idx;
  document.getElementById("sec7-tip-title").innerHTML = timelineDictList[idx - 1]['title'];
  document.getElementById("sec7-tip-text").innerHTML = timelineDictList[idx - 1]['text'];
  var imageId = "sec7-img" + idx.toString();
  var imageName = "../img/07-img-" + idx.toString() + "-hover.png";
  d3.select('#sec7-tip').transition().duration(300).style("margin-left", tipMarginNow.toString()+ "px");
  document.getElementById(imageId).src = imageName;
}

function changeImg(idx){
  var imageId = "sec7-img" + idx.toString();
  var imageName = "../img/07-img-" + idx.toString() + ".png";
  document.getElementById(imageId).src = imageName;
}

function showBackToPrev(){
  d3.select('#backtoprev').transition().duration(2000).style("opacity", "1");
  $("#backtoprev").css("pointer-events", "auto");
}
