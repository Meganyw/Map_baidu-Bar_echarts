
$(function(){
        setMapEvent();
        addMapControl();
        getBoundary();
        top_bar();
        bottom_bar();
})
// 百度地图API功能
map = new BMap.Map("allmap");
map.centerAndZoom(new BMap.Point(112.750865,30.762653), 3);
var data_info = [
    [114.502461,38.045474,"网站名称：市住房公积金管理中心;网站ip:192.168.1.100;网站URL:www.jdin.com;",30,[3,2,3,4],[3,4,3,7,2]],
    [120.153576,29.287459,"网站名称：浙江省嘉兴市第一中学<br>网站ip:192.168.1.100<br>网站URL:www.jdin.com",91,[4,2,3,4],[3,4,6,5,2]],
    [120.750865,30.762653,"网站名称：嘉兴经济技术开发区人力资源网",80,[5,2,3,4],[3,4,1,7,2]],
    [121.428599,28.661378,"网站名称：嘉兴315维权网<br>网站ip:192.168.1.100<br>网站URL:www.jdin.com",20,[6,2,3,4],[3,4,3,7,2]],
    [120.153576,30.287459,"网站名称：嘉兴旅游",80,[7,2,3,4],[3,4,6,7,2]],
    [120.205170,30.25720,"网站名称：嘉兴市青少年宫",92,[8,2,3,4],[3,4,6,7,2]],
    [120.753576,30.687459,"网站名称：嘉兴市公共交通总局",55,[9,2,3,4],[3,9,6,3,2]],
    [120.750865,30.762653,"网站名称：嘉兴福利彩票",35,[1,2,3,4],[2,1,3,7,2]],
    [119.750865,29.762653,"网站名称：嘉兴电视台",15,[1,2,3,4],[3,4,5,2,2]],
    [120.750865,30.762653,"网站名称：市委老干部局",95,[1,2,3,4],[3,3,6,6,1]],
    [119.306239,28.075302,"网站名称：嘉兴消防支队",75,[1,2,3,4],[3,3,8,7,2]],
    [120.253576,30.387459,"网站名称：嘉兴技师学院",15,[1,2,3,4],[1,4,2,7,2]],
    [120.298572,30.584355,"网站名称：嘉兴经济技术开发区行政审批中心",15,[1,2,3,4],[3,4,5,3,2]],
    [120.153576,30.587459,"网站名称：嘉兴北师大南湖附属高中",85,[3,2,3,4],[2,9,6,7,2]]
];
var opts = {
    width : 250,     // 信息窗口宽度
    height: 90,     // 信息窗口高度
    title : "网站信息" , // 信息窗口标题
    enableMessage:true//设置允许信息窗发送短息
};
var  mapStyle ={
    features: ["road", "building","water","land"],//隐藏地图上的poi
    style : "normal"//设置地图风格为高端黑
}
map.setMapStyle(mapStyle);
for(var i=0;i<data_info.length;i++){
    // var marker = new BMap.Marker(new BMap.Point(data_info[i][0],data_info[i][1]));  // 创建标注
    var content = data_info[i][2];
    var series_data1 = data_info[i][4];
    var series_data2 = data_info[i][5];
    // console.log(series_data);
    var pt = new BMap.Point(data_info[i][0],data_info[i][1]);
    var myIcon = new BMap.Icon("images/marker_yellow.png", new BMap.Size(30,30));
    var myIcon1 = new BMap.Icon("images/marker_green.png", new BMap.Size(30,30));
    var myIcon2 = new BMap.Icon("images/marker_red.png", new BMap.Size(30,30));

    if(data_info[i][3] <= 60){
        var marker2 = new BMap.Marker(pt,{icon:myIcon2});
        map.addOverlay(marker2);
        marker2.setAnimation(BMAP_ANIMATION_BOUNCE);
    }else if(data_info[i][3] >= 60 && data_info[i][3] < 80){
        var marker2 = new BMap.Marker(pt,{icon:myIcon});
        map.addOverlay(marker2);
    }else if(data_info[i][3] >= 80 && data_info[i][3] <= 100){
        var marker2 = new BMap.Marker(pt,{icon:myIcon1});
        map.addOverlay(marker2);
    }
    addClickHandler(series_data1,series_data2,content,marker2);
}

function addClickHandler(data,data2,content,marker){
    marker.addEventListener("click",function(e){
        openInfo(content,e,data,data2);
    });
}

function openInfo(content,e,data,data2){
    var p = e.target;
    var point = new BMap.Point(p.point.lng, p.point.lat);
    var infoWindow = new BMap.InfoWindow(content,opts);// 创建信息窗口对象
    map.openInfoWindow(infoWindow,point); //开启信息窗口

    option1.series[0].data = data;
    Chart1.setOption(option1);

    option2.series[0].data = data2;
    Chart2.setOption(option2);

}

function setMapEvent(){
    map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
    map.enableScrollWheelZoom();//启用地图滚轮放大缩小
    map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
    map.enableKeyboard();//启用键盘上下左右键移动地图
}
var blist = [];
var districtLoading = 0;

function getBoundary() {
    addDistrict("浙江");
}

/**
 * 添加行政区划
 * @param {} districtName 行政区划名
 * @returns  无返回值
 */
function addDistrict(districtName) {
    //使用计数器来控制加载过程
    districtLoading++;
    var bdary = new BMap.Boundary();
    bdary.get(districtName, function (rs) {       //获取行政区域
        var count = rs.boundaries.length; //行政区域的点有多少个
        if (count === 0) {
            alert('未能获取当前输入行政区域');
            return;
        }
        for (var i = 0; i < count; i++) {
            blist.push({ points: rs.boundaries[i], name: districtName });
        };
        //加载完成区域点后计数器-1
        districtLoading--;
        if (districtLoading == 0) {
            //全加载完成后画端点
            drawBoundary();
        }
    });
}

function drawBoundary() {
    //包含所有区域的点数组
    var pointArray = [];

    /*画遮蔽层的相关方法
    *思路: 首先在中国地图最外画一圈，圈住理论上所有的中国领土，然后再将每个闭合区域合并进来，并全部连到西北角。
    *      这样就做出了一个经过多次西北角的闭合多边形*/
    //定义中国东南西北端点，作为第一层
    var pNW = { lat: 0.0, lng: 0.0 }
    var pNE = { lat: 0.0, lng: 0.0 }
    var pSE = { lat: 0.0, lng: 0.0 }
    var pSW = { lat: 0.0, lng: 0.0 }
    //向数组中添加一次闭合多边形，并将西北角再加一次作为之后画闭合区域的起点
    var pArray = [];
    pArray.push(pNW);
    pArray.push(pSW);
    pArray.push(pSE);
    pArray.push(pNE);
    pArray.push(pNW);
    //循环添加各闭合区域
    for (var i = 0; i < blist.length; i++) {
        //添加显示用标签层
        var label = new BMap.Label(blist[i].name, { offset: new BMap.Size(100, -20) });
        label.hide();
        map.addOverlay(label);
        //添加多边形层并显示
        var ply = new BMap.Polygon(blist[i].points, { strokeWeight: 5, strokeColor: "#FF0000", fillOpacity: 0.01, fillColor: " #fff" }); //建立多边形覆盖物
        ply.name = blist[i].name;
        ply.label = label;
        ply.addEventListener("click", click);
        /*ply.addEventListener("mouseover", mouseover);
        ply.addEventListener("mouseout", mouseout);
        ply.addEventListener("mousemove", mousemove);*/
        map.addOverlay(ply);

        //添加名称标签层
        var centerlabel = new BMap.Label(blist[i].name, { offset: new BMap.Size(20, 20) });
        centerlabel.setPosition(ply.getBounds().getCenter());
        map.addOverlay(centerlabel);

        //将点增加到视野范围内
        var path = ply.getPath();
        pointArray = pointArray.concat(path);
        //将闭合区域加到遮蔽层上，每次添加完后要再加一次西北角作为下次添加的起点和最后一次的终点
        pArray = pArray.concat(path);
        pArray.push(pArray[0]);
    }

    //限定显示区域，需要引用api库
    var boundply = new BMap.Polygon(pointArray);
    BMapLib.AreaRestriction.setBounds(map, boundply.getBounds());
    map.setViewport(pointArray);    //调整视野

    //添加遮蔽层
    var plyall = new BMap.Polygon(pArray, { strokeOpacity: 0.0000001, strokeColor: "#000000", strokeWeight: 0.00001, fillColor: "blue", fillOpacity: 0.5 }); //建立多边形覆盖物
    map.addOverlay(plyall);
}

/*  添加缩略图和缩放控件 */
function addMapControl(){
  var scaleControl = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT});
  scaleControl.setUnit(BMAP_UNIT_METRIC);
  map.addControl(scaleControl);
  var navControl = new BMap.NavigationControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,type:0});
  map.addControl(navControl);
  var overviewControl = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_TOP_LEFT,isOpen:true});
  map.addControl(overviewControl);
}

function top_bar(){
    var Chart1 = echarts.init(document.getElementById('echarts1'));
    var series = [];
    var option1 = {
        title: {
            x: 'center',
            subtextStyle:{
                //文字颜色
                color:'#ccc',
                //字体风格,'normal','italic','oblique'
                fontStyle:'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight:'bold',
                //字体系列
                fontFamily:'sans-serif',
                //字体大小
        　　　　 fontSize:16
            },
            subtext: '安全风险',
            link: 'http://echarts.baidu.com/doc/example.html'
        },
        backgroundColor:'#1b1b1b',
        tooltip: {
            trigger: 'item'
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {show: true, readOnly: false},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        grid: {
            borderWidth: 0,
            y: 80,
            y2: 60
        },
        xAxis: [
            {
                type: 'category',
                show: false,
                data: ['web漏洞', '可用性', '敏感词', '弱口令']
            }
        ],
        yAxis: [
            {
                type: 'value',
                show: false
            }
        ],
        series:[
            {
                name: '网站通报事件个数统计',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: function(params) {
                            // build a color map as your need.
                            var colorList = [
                              '#ff6600','#99cc00','#66cc99','#66cccc'
                            ];
                            return colorList[params.dataIndex]
                        },
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{b}\n{c}'
                        }
                    }
                },
                data: series_data1
            }
        ]

    };
    Chart1.setOption(option1);
}

function bottom_bar(){
    var Chart2 = echarts.init(document.getElementById('echarts2'));
    option2 = {
        title: {
            x: 'center',
            subtextStyle:{
                //文字颜色
                color:'#ccc',
                //字体风格,'normal','italic','oblique'
                fontStyle:'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight:'bold',
                //字体系列
                fontFamily:'sans-serif',
                //字体大小
        　　　　fontSize:16
            },
            subtext: '安全威胁',
            link: 'http://echarts.baidu.com/doc/example.html'
        },
        backgroundColor:'#1b1b1b',
        tooltip: {
            trigger: 'item'
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {show: true, readOnly: false},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        grid: {
            borderWidth: 0,
            y: 80,
            y2: 60
        },
        xAxis: [
            {
                type: 'category',
                show: false,
                data: ['网站木马','网页篡改',  '植入暗链',  'WebShell','钓鱼']
            }
        ],
        yAxis: [
            {
                type: 'value',
                show: false
            }
        ],
        series: [
            {
                name: '网站通报事件个数统计',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: function(params) {
                            // build a color map as your need.
                            var colorList = [
                              '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B'
                            ];
                            return colorList[params.dataIndex]
                        },
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{b}\n{c}'
                        }
                    }
                },
                data: series_data2
            }
        ]
    };
    Chart2.setOption(option2);
}
