d3.json("data/tw_county_topo_mod.json", function (data) {
  d3.csv("data/region_peopleNum.csv", function(data_region){


    topo = topojson.feature(data, data.objects.layer1);

    var region_map = {}

    for (var i in data_region){
      region_map[data_region[i]['region']] = data_region[i]['number'];
    }

    prj = d3.geo.mercator().center([120.971864, 23.960998])
      .scale(6000).translate([290, 280]);
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
    width = 550;
    height = 700; //780

    var svg = d3.select('.demo').append('svg').attr({'width': width, 'height': height});

    var block = svg.append("g")
              .attr("id","map-g")
              .selectAll("path").data(topo.features).enter()
              .append("path")
              .attr("d",path);
              // .attr("fill", function(d){
              //   return "red";
              // })
              // .attr("stroke","black")
              // .attr("stroke-width", "1.0")

    var dorling = d3.select("svg").selectAll("circle").data(topo.features).enter()
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
      .attr("fill", "red")
      .on("mouseover",function(it){
        console.log(it.properties.COUNTYNAME);
      });

    forceNodes = [];
    for(i = 0 ; i < topo.features.length ; i++ ) {
      if(topo.features[i].properties.value != 0)
        forceNodes.push(topo.features[i].properties);
    }
    // force layout, makes circles closer.
    // This is useful when circle radius changes.
    console.log(forceNodes);
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