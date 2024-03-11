/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "^(UC01_REGISTR_USER|UC02_GET_BY_EMAIL|UC03_GET_ALL|Dashboard_Report_Generation)(-success|-failure)?$";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9071026740353398, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "UC01_PRE_REGISTR_USER"], "isController": true}, {"data": [0.9964028776978417, 500, 1500, "UC01_REGISTR_USER"], "isController": true}, {"data": [1.0, 500, 1500, "UC01_POST_DELETE_BY_ID"], "isController": true}, {"data": [1.0, 500, 1500, "PRE HTTP CREATE USER"], "isController": false}, {"data": [0.9977282114828583, 500, 1500, "MAIN HTTP GET BY EMAIL"], "isController": false}, {"data": [1.0, 500, 1500, "POST HTTP LOGIN"], "isController": false}, {"data": [1.0, 500, 1500, "POST HTTP DELETE BY ID"], "isController": false}, {"data": [1.0, 500, 1500, "PRE HTTP LOGIN"], "isController": false}, {"data": [0.75, 500, 1500, "POST HTTP GET ALL"], "isController": false}, {"data": [1.0, 500, 1500, "UC01_POST_GET_ALL"], "isController": true}, {"data": [0.49945887445887444, 500, 1500, "MAIN HTTP GET ALL"], "isController": false}, {"data": [0.9977366255144033, 500, 1500, "UC02_GET_BY_EMAIL"], "isController": true}, {"data": [0.5, 500, 1500, "UC03_GET_ALL"], "isController": true}, {"data": [1.0, 500, 1500, "MAIN HTTP LOGIN"], "isController": false}, {"data": [0.9973570398846708, 500, 1500, "MAIN HTTP CREATE USER"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 20235, 0, 0.0, 280.6208549542866, 0, 2545, 227.0, 735.0, 816.0, 929.0, 7.186074038403147, 700.417919585177, 4.569827371750685], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["UC01_PRE_REGISTR_USER", 2500, 0, 0.0, 66.49360000000001, 57, 201, 61.0, 73.0, 83.0, 168.98999999999978, 5.030181086519114, 2.4856168259557343, 4.032986984406438], "isController": true}, {"data": ["UC01_REGISTR_USER", 2085, 0, 0.0, 268.1520383693044, 0, 2008, 254.0, 333.0, 355.0, 432.0, 1.9306091835884331, 0.95216222730724, 1.5449114399589803], "isController": true}, {"data": ["UC01_POST_DELETE_BY_ID", 4581, 0, 0.0, 66.21982099978194, 57, 211, 61.0, 71.0, 82.0, 168.0, 5.011240011157967, 2.4517883257716226, 2.994998912918629], "isController": true}, {"data": ["PRE HTTP CREATE USER", 2500, 0, 0.0, 66.49360000000001, 57, 201, 61.0, 73.0, 83.0, 168.98999999999978, 5.010642604892793, 2.4759620684333523, 4.017321854118147], "isController": false}, {"data": ["MAIN HTTP GET BY EMAIL", 7263, 0, 0.0, 257.94589012804613, 55, 1278, 243.0, 322.0, 344.0, 419.0, 6.41306382512812, 2.649146482450386, 3.8891724955122684], "isController": false}, {"data": ["POST HTTP LOGIN", 12, 0, 0.0, 217.83333333333331, 208, 226, 218.5, 225.4, 226.0, 226.0, 0.012813448996066271, 0.01368936836103174, 0.003991689677485489], "isController": false}, {"data": ["POST HTTP DELETE BY ID", 4581, 0, 0.0, 66.21982099978194, 57, 211, 61.0, 71.0, 82.0, 168.0, 5.00067134094623, 2.4466175213027945, 2.9886824811123955], "isController": false}, {"data": ["PRE HTTP LOGIN", 10, 0, 0.0, 215.5, 205, 226, 215.0, 225.8, 226.0, 226.0, 9.066183136899365, 9.685941749773345, 2.567571396192203], "isController": false}, {"data": ["POST HTTP GET ALL", 2, 0, 0.0, 414.0, 59, 769, 414.0, 769.0, 769.0, 769.0, 0.0021359397494115488, 0.7602036928929808, 0.0011722638077825101], "isController": false}, {"data": ["UC01_POST_GET_ALL", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 4.286943855932203, 9.302171610169491], "isController": true}, {"data": ["MAIN HTTP GET ALL", 3696, 0, 0.0, 743.9710497835489, 407, 2359, 747.0, 882.3000000000002, 929.1499999999996, 1084.0899999999992, 3.2855202429293757, 1743.3630998646813, 1.8031859145764737], "isController": false}, {"data": ["UC02_GET_BY_EMAIL", 7290, 0, 0.0, 256.9905349794235, 0, 1278, 243.0, 322.0, 343.4499999999998, 419.0, 6.436904211095139, 2.649146482450386, 3.8891724955122684], "isController": true}, {"data": ["UC03_GET_ALL", 3704, 0, 0.0, 744.1271598272118, 0, 2545, 746.0, 883.0, 931.0, 1110.4999999999982, 3.292631758606712, 1743.3630998646813, 1.8031859145764737], "isController": true}, {"data": ["MAIN HTTP LOGIN", 45, 0, 0.0, 232.6, 206, 348, 223.0, 277.4, 325.5999999999999, 348.0, 0.06885334696119579, 0.07356011872612128, 0.0194994830261199], "isController": false}, {"data": ["MAIN HTTP CREATE USER", 2081, 0, 0.0, 266.9927919269581, 60, 1165, 254.0, 332.0, 354.0, 428.3599999999997, 1.926905377001213, 0.95216222730724, 1.5449114399589803], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 20235, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
