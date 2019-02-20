
var strUrl = "http://socrat4.remdal.ru/";
var arr = [
	strUrl + "grammometr_gs-5/",
	strUrl + "grammometr_gs-15/",
	strUrl + "grammometr_gs-25/",
	strUrl + "grammometr_gs-50/",
	strUrl + "grammometr_gs-60/",
	strUrl + "grammometr_gs-150/",
	strUrl + "grammometr_gs-300/"
];

var width=screen.width; // ширина
var pizza0 = document.getElementsByClassName('wpsm_panel-collapse')[0];
var pizza1 = document.getElementsByClassName('wpsm_panel-collapse')[1];
var burger0 = document.getElementsByClassName('ac_open_cl_icon')[0];
var burger1 = document.getElementsByClassName('ac_open_cl_icon')[1];
if (width<=600){
   pizza1.classList.remove('in');
   pizza0.classList.remove('in');
   burger0.classList.remove('fa-minus');
   burger0.classList.add('fa-plus');
}else{
 if(arr.includes(window.location.href)) {
         pizza0.classList.remove('in');
         pizza1.classList.add('in');
         burger1.classList.remove('fa-plus');
         burger1.classList.add('fa-minus');
         burger0.classList.remove('fa-minus');
         burger0.classList.add('fa-plus');
 }
}

var el = document.querySelectorAll('.wpsm_panel-collapse a'); // выбираем все ссылки в нашем меню // и прогоняем через цикл
for(i=0;i<el.length; i++){ 
// если значение атрибута совпадает с урлом в браузере то
 if(el[i].href==window.location){
  el[i].className +=" current"; // добавляем нужный класс для выделения пункта
 }
}


var arr2 = [
	strUrl + "o_nas/",
	strUrl + "dostavka/",
	strUrl + "garantiya/",
	strUrl + "kontakty/",
	strUrl + "tekhnicheskaya_podderzhka/"
];

var pasta0 = document.getElementsByClassName('main-content')[0];
var pasta1 = document.getElementsByClassName('left-menu')[0];
var pasta2 = document.getElementsByClassName('kontact-blok')[0];

if ((width<=600) && arr2.includes(window.location.href)) {
  pasta0.insertBefore(pasta1, pasta2);
}



var currentColumn = null;
var tableArr = document.getElementsByClassName("light-rows");

for(let i = 0; i < tableArr.length; i++){
	if (tableArr[i]!=null){
		tableArr[i].addEventListener("mouseover", mouseOver);
		tableArr[i].addEventListener("mouseout", mouseOut);
	}
}

function mouseOver(event) {
	if (currentColumn) {
		// перед тем, как зайти в новый элемент, курсор всегда выходит из предыдущего
		// если мы еще не вышли, значит это переход внутри элемента, отфильтруем его
		return;
	}
	// посмотрим, куда пришёл курсор
	var target = event.target;
	// уж не на TD ли?
	while (target != this) {
		if (target.tagName == 'TD') break;
		target = target.parentNode;
	}
	if (target == this) return;
	// да, элемент перешёл внутрь TD!
	currentColumn = target;

	//если ячейка объедененная то выделяем все смежные строки
	var currentRowIndex = target.parentNode.rowIndex;
	if (target.hasAttribute('rowspan')){
		rowSpan = +target.getAttribute('rowspan');
		for(let i=currentRowIndex; i<currentRowIndex+rowSpan; i++){
			highlightRow(this.rows[i].children);
		}
	}

	//выделяем ячейки текущего ряда
	//if(target.parentNode.className != 'row-1'){
		highlightRow(target.parentNode.children);
	//}
	var vv = 0;
	var missingCol= findMissingColums(getAllColumnsNumbersInRow(target.parentNode.children),this);
	//проходимся по масиву с перечнем отсутствующих ячеек в текущем ряду и ищем каждый его элемент
	for(let i = 0; i<missingCol.length; i++){
		// vv++;			console.log(missingCol);
		top:
		//проходимся по всем рядам от текущего и выше для поиска нужного нам столбца
		for(let j = currentRowIndex; j >= 0; j--){
			var currentRowChildrenArr = this.rows[j].children;
			//проходимся по всем ячейкам ряда
			for(let y = 0; y<currentRowChildrenArr.length; y++){
				let str = currentRowChildrenArr[y].className;
				//ищем совпадения "класс ячейки" и "отсутствующая ячейка"
				if (str.indexOf('column-'+missingCol[i])!=-1){
					highlightCell(currentRowChildrenArr[y]);
					// console.log(currentRowChildrenArr[y]);
					break top;				
				}
				//проверяем на обьеденение колонок (если ячейка выделенного ряда обьеденена то ячейку выше выделять не нужно и выходим с цикла по рядам)
				if(j == currentRowIndex && currentRowChildrenArr[y].hasAttribute('colspan')){
					break top;				
				}
			}
		}
	}
console.log(vv);
};


function mouseOut(event) {
	// если курсор и так снаружи - игнорируем это событие
	if (!currentColumn) return;
	// произошёл уход с элемента - проверим, куда, может быть на потомка?
	var relatedTarget = event.relatedTarget;
	if (relatedTarget) { // может быть relatedTarget = null
		while (relatedTarget){
			// идём по цепочке родителей и проверяем,
			// если переход внутрь currentColumn - игнорируем это событие
			if (relatedTarget == currentColumn) return;
			relatedTarget = relatedTarget.parentNode;
		}
	}
	//очищаем всю таблицу от закраски цветом
	for(let j = this.rows.length-1; j >= 0; j--){
	 	var row_children=this.rows[j].children;
 		for (let i = 0; i < row_children.length; i++){
			row_children[i].classList.remove('highlight');
		}
	}
	// произошло событие mouseout, курсор ушёл
	currentColumn = null;
};

/*вычисляем все номера ячеек (в соответствии с имененм класса) строки и записываем в масив*/
function getAllColumnsNumbersInRow(row_children){
	//проходимся по всемя ячейкам ряда
	var columnNambersArr = []; // массив для перечня всех номеров столбцов текущей строки
	var x=0; // счетчик для массива
	for (let i = 0; i < row_children.length; i++) {
		//считываем имя класса каждой ячейки в переменную str
		let str=row_children[i].className;
		// вычисляем какие у нас есть номера столбцов а каких нет
		let numb = 0; //полученный номер столбца
		//перебираем символы имени класа столбца и ищем числа
		for(let j=0; j<str.length; j++){
			if(!isNaN(str[j]) && str[j]!=" "){
				numb = numb + str[j];
				if(!isNaN(str[j+1]) && str[j+1]!=" "){
					numb = numb + str[j];
				}
				//записываем все числа (максимум двузначные) в массив
				columnNambersArr[x] = Number(numb);
				x++;
				numb = 0;
			}
		}
	}
	return columnNambersArr; // возвращаем массив со всеми номерами столбцов 
}

/*ищет все пропущенные ячейки в масиве(все ячейки ряда) и записывает в масив disableColumnNambersArr*/
function findMissingColums(columnArr,table){
	// перебираем масив в поиске отсутствующих столбцов   
	var disableColumnNambersArr = []; // массив для перечня всех номеров обьедененных столбцов текущей строки   
	for(let i = 1; i<=calculateCells(table); i++){
		if(!columnArr.includes(i)){
			disableColumnNambersArr.push(i);			
		}
	}//нашли все отсутствующие столбцы в текущем ряде
	return disableColumnNambersArr; // возвращаем массив со всеми пропущенными номерами столбцов в ряде
}

/*закрашивает все ячейки ряда*/
function highlightRow(row_children){
	for (let i = 0; i < row_children.length; i++) {
		row_children[i].classList.add('highlight');
	}
}

/*закрашивает ячейку*/
function highlightCell(row_children){
		row_children.classList.add('highlight');
}

/*вычесляет количество столбцов таблицы*/
function calculateCells(sheet){
    var max = 0;
    for(var i=0;i<sheet.rows.length;i++) {
        if(max < sheet.rows[i].cells.length)
            max = sheet.rows[i].cells.length;
    }
    return max;
}