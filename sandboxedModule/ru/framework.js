// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm'),
	os = require('os'),
    util = require('util');

var defapp = 'application';
var app = process.argv[2]||defapp; // для 4-го задания тоже подойдет


/*var newconsole = new console.Console(process.stdout, process.stderr);
newconsole.log = function(){
	
	var date = new Date(),
	logArguments = Array.prototype.slice.call(arguments);
	logArguments.unshift(date);
	logArguments.unshift(app);
	console.log.apply(console, logArguments); //apply - вызывает функцию с заданным значением this argument
	
	//console.log.apply(console, [app, date].concat(logArguments)); //
	
};*/
//песочница - изолированніе контекст которій не влияет на глобальный контекст.

var newconsole = {
	log:function(){
		
		var date = new Date(),
			argsArray = Array.prototype.slice.call(arguments),
			logArgs = [app, date].concat(argsArray),
			message = logArgs.join(' ') + os.EOL;
		fs.appendFile('applicationLog.txt', message, function (err) {
			if (err) console.error(err);
		});
	},
};




//4-е задание норм	
/*var newconsole = {
	log:function(){
		
		var date = new Date(),
		logArguments = Array.prototype.slice.call(arguments); 
		logArguments.unshift(date);
		logArguments.unshift(app);
		console.log.apply(console, logArguments); //apply - вызывает функцию с заданным значением this argument
		
		//можно сделать console.log. и через зап перечислить что выводить
		
		
		
		//console.log.apply(console, [app, date].concat(logArguments)); // тут выше быстродействие поскольку нет добавления в начало
		
	},
};

*/

/* новая обертка для консоли
function wrapFunction(name) { //Фукция которая создает функцию обертки
	return function () {
		var date = new Date(),
			logArguments = Array.prototype.slice.call(arguments);
		console[name].apply(console, [app, date].concat(logArguments)); //
	};
}

var newconsole = {},    //объект на который будет заменена консоль
    functionsToWrap = ['log', 'info', 'warn', 'error'];
for (var key in console) {
	if (!console.hasOwnProperty(key) || key === 'Console') {
		continue;
	}
	if (functionsToWrap.indexOf(key) !== -1) {
		newconsole[key] = wrapFunction(key);
	} else {
		newconsole[key] = console[key];
	}
}

*/

	
// Чоздаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = { module: {}, console: newconsole,util:util,setTimeout:setTimeout,setInterval:setInterval };
context.global = context; //
var sandbox = vm.createContext(context);





// Читаем исходный код приложения из файла
var fileName = './'+app+'.js';

//var fileName = './application.js';



fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
  sandbox.module.exports();
  
  
  
  //sandbox.module.exports(); // Если так запускать то нужно в приложении module.exports писать

  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
});
